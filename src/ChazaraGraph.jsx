import { yearStart } from "./utils/Quarters";
import { useState, useEffect, useRef } from "react";
import supabase from "./utils/supabase";
import html2canvas from "html2canvas"; // Import html2canvas
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

let startDate = yearStart;
while(startDate.weekdayLong !== "Sunday") {
  startDate = startDate.plus({days: 1})
}

function getCurrentWeekNumber() {
  const currentDate = new Date()
  const diffInTime = currentDate - startDate
  const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24))
  const weekNumber = Math.floor(diffInDays / 7) + 1
  return weekNumber;
}
const weekNumber = getCurrentWeekNumber()

export default function UserProgressGraph({
  clickedDownload,
  setClickedDownload,
}) {
  const [userProgressData, setUserProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [barSize, setBarSize] = useState(null) 
  const chartRef = useRef(null); // Ref to access the SVG

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all users
        const { data: users, error: usersError } = await supabase
          .from("users")
          .select("user_id, first_name, last_name, pledged_minutes")
          .neq("user_id", "9e1a919b-20cc-4557-a21f-a50871cd4cbb")
          .neq("user_id", "baab5a0d-fb3e-4b2b-911b-a11703ebda4d")
          .neq("user_id", "dee35438-817c-4308-acef-c186072b278b");

        if (usersError) throw usersError;

        // Fetch all sessions
        const { data: sessions, error: sessionsError } = await supabase
          .from("sessions")
          .select("user_id, session_length");

        if (sessionsError) throw sessionsError;

        // Aggregate session data by user
        const userProgressMap = {};

        sessions.forEach((session) => {
          if (!userProgressMap[session.user_id]) {
            userProgressMap[session.user_id] = 0;
          }
          userProgressMap[session.user_id] += session.session_length;
        });

        // Prepare final data for the graph
        const progressData = users.map((user) => {
          const totalMinutes = userProgressMap[user.user_id] || 0;
          const pledgedSoFar = user.pledged_minutes * weekNumber
          const extraMinutes = Math.max(totalMinutes - pledgedSoFar, 0); // Extra minutes learned
          console.log(pledgedSoFar)
          const minutesOwed = Math.max(pledgedSoFar - totalMinutes, 0); // Minutes owed if they haven't met the pledged minutes
          const name = `${user.first_name[0].toUpperCase()}.${user.last_name[0].toUpperCase()}`;
          return {
            name,
            minutesOwed,
            extraMinutes,
            learnedMinutes: totalMinutes,
          };
        });
        progressData.sort((a, b) => {
          const totalMinutesA = a.learnedMinutes + a.minutesOwed + a.extraMinutes;
          const totalMinutesB = b.learnedMinutes + b.minutesOwed + b.extraMinutes;
          return totalMinutesB - totalMinutesA;
        })
        setUserProgressData(progressData);
      } catch (error) {
        console.error("Error fetching data from Supabase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

   useEffect(() => {
    if (clickedDownload) {
      handleDownload()
      setClickedDownload(false);
    }
  }, [clickedDownload]);

  const handleDownload = async () => {
    if (chartRef.current) {
      const chartElement = chartRef.current;
      const originalWidth = chartElement.style.height;
      const originalHeight = chartElement.style.height;

      //Apply temp styles for downloading
      chartElement.style.height = "700";
      chartElement.style.width = "60%";
      setBarSize(20);
      //Wait for the chart to re-render
      await new Promise((resolve) => setTimeout(resolve, 1000));

      //Capture the chart with html2canvas
      const naturalWidth = chartElement.offsetWidth;
      const naturalHeight = chartElement.offsetHeight;
      const canvas = await html2canvas(chartElement, {scale: 1, width: naturalWidth, height: naturalHeight});
      const squareSize = Math.max(naturalWidth, naturalHeight);
      const squareCanvas = document.createElement('canvas');
      squareCanvas.width = squareSize;
      squareCanvas.height = squareSize;
      const ctx = squareCanvas.getContext('2d');
      const scale = squareSize / Math.max(naturalWidth, naturalHeight);
      const xOffset = (squareSize - naturalWidth * scale) / 2;
      const yOffset = (squareSize - naturalHeight * scale) / 2;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, squareSize, squareSize); 
      ctx.drawImage(canvas, 0, 0, naturalWidth, naturalHeight, xOffset, yOffset, naturalWidth * scale, naturalHeight * scale);
      const link = document.createElement("a");
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      link.href = squareCanvas.toDataURL("image/png");
      link.download = `chazarah_chart_${formattedDate}.png`;
      link.click();
      chartElement.style.height = originalHeight;
      chartElement.style.width = originalWidth
      setBarSize(null);
    }
  };
  
 
  if (loading) return <p>Loading...</p>;
  if (!userProgressData.length) return "No data found";

  return (
    <div className="graph-container">
      <div style={{ marginBottom: "10px" }}></div>
      <div ref={chartRef}>
        <ResponsiveContainer
          width="100%"
          // height={500}
          height={500}
          className={"graph-container"}
        >
          <BarChart data={userProgressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="learnedMinutes"
              stackId="a"
              fill="#6495ED"
              name="Minutes Learned to Date"
              barSize={barSize || null}
            />
            <Bar
              dataKey="minutesOwed"
              stackId="a"
              fill="#fbb4ae"
              name="Minutes Owed to Date"
            />
            <Bar
              dataKey="extraMinutes"
              stackId="a"
              fill="#90EE90"
              name="Extra Minutes Learned"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
