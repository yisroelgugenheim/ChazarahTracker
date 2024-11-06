import { useState, useEffect } from "react";
import supabase from "./utils/supabase";
import GetUpdateSessions from "./ADMIN/GetUpdateSessions";
import AddSessions from "./ADMIN/AddSessions";
import MakeAdmin from "./ADMIN/MakeAdmin";
import GetWeeks from "./ADMIN/GetWeeks";
import AutoComplete from "./ADMIN/AutoComplete";
import DeleteUser from "./ADMIN/DeleteUser";
import AddUser from "./ADMIN/AddUser";
import InsertPaymentRecord from "./ADMIN/InsertPaymentRecord";
import UpdatePledge from "./ADMIN/UpdatePledge";
import GetAllOwed from "./ADMIN/GetAllOwed";
import GetAllSessions from "./utils/GetAllSessions";
import { useNavigate } from "react-router-dom";

function AdminPanel({ activeComponent, isAdmin }) {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [autoComplete, setAutoComplete] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(isAdmin);
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select()
          .neq("email", "office@ateresami.org")
          .neq("email", "yisgug@gmail.com")
          .neq("email", "naftoligug@gmail.com");

        if (error) {
          console.error("Error fetching users:", error);
          return;
        }
        const usersArray = data.map((user) => ({
          user_id: user.user_id,
          name: `${user.first_name} ${user.last_name}`,
        }));

        setUsers(usersArray);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [selectedUserId]);

  useEffect(() => {
    if (
      activeComponent &&
      activeComponent !== "addUser" &&
      activeComponent !== "getAllOwed" &&
      activeComponent !== "getAllSessions"
    ) {
      setAutoComplete(true);
    } else {
      setAutoComplete(false);
    }
  }, [activeComponent]);

  return (
    <>
      <div style={{ marginLeft: "-10px" }}>
        {autoComplete && (
          <AutoComplete users={users} setSelectedUserId={setSelectedUserId} />
        )}
      </div>

      <div className="admin-component">
        {activeComponent === "getAllOwed" && <GetAllOwed />}

        {activeComponent === "getUpdateSessions" && (
          <GetUpdateSessions
            selectedUserId={selectedUserId}
            selectedSessionId={selectedSessionId}
            setSelectedSessionId={setSelectedSessionId}
          />
        )}
        {activeComponent === "getAllSessions" && <GetAllSessions />}

        {activeComponent === "addSessions" && (
          <AddSessions selectedUserId={selectedUserId} />
        )}

        {activeComponent === "makeAdmin" && (
          <MakeAdmin selectedUserId={selectedUserId} />
        )}

        {activeComponent === "getWeeks" && (
          <GetWeeks selectedUserId={selectedUserId} />
        )}

        {activeComponent === "deleteUser" && (
          <DeleteUser selectedUserId={selectedUserId} />
        )}

        {activeComponent === "addUser" && <AddUser />}
        {activeComponent === "insertPayRecord" && (
          <InsertPaymentRecord selectedUserId={selectedUserId} />
        )}
        {activeComponent === "updatePledge" && (
          <UpdatePledge selectedUserId={selectedUserId} />
        )}
        {activeComponent === "chazaraGraph" && navigate("/graph")}
      </div>
      <div
        style={{
          position: "fixed",
          bottom: "10px",
          width: "calc(100% - 40px)", // Adjust width to account for padding
          display: "flex",
          justifyContent: "space-between",
          padding: "0 20px",
        }}
      ></div>
    </>
  );
}

export default AdminPanel;
