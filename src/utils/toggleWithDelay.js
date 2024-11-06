export default function toggleWithDelay(func, value1, value2, delay) {
  func(value1);
  setTimeout(() => func(value2), delay);
}
