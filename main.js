const token = "8bFJuwEs59bafozvolCBdtJYXSu1";
const api_path = "xiaoweieric";

axios
  .get(
    `https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_path}/orders`,
    {
      headers: {
        Authorization: token,
      },
    }
  )
  .then((resp) => {
    console.log("===>", resp);
  })
  .catch((err) => console.log("err:", err));

console.log("hello");

// C3.js
let chart = c3.generate({
  bindto: "#chart", // HTML 元素綁定
  data: {
    type: "pie",
    columns: [
      ["Louvre 雙人床架", 1],
      ["Antony 雙人床架", 2],
      ["Anty 雙人床架", 3],
      ["其他", 4],
    ],
    colors: {
      "Louvre 雙人床架": "#DACBFF",
      "Antony 雙人床架": "#9D7FEA",
      "Anty 雙人床架": "#5434A7",
      其他: "#301E5F",
    },
  },
});
