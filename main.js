// API Settings
const token = "8bFJuwEs59bafozvolCBdtJYXSu1";
const api_path = "xiaoweieric";
const SERVER_URL = `https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_path}/orders`;

// Data
let orderData = null;

// func
function getOrderList() {
  console.log("get order list");
  axios
    .get(SERVER_URL, {
      headers: {
        Authorization: token,
      },
    })
    .then((resp) => {
      console.log("===>", resp.data);
      const { data, status } = resp;
      if (status) {
        orderData = data.orders;
        render();
      }
    })
    .catch((err) => console.log("err:", err));
}

function modifyOrder() {
  console.log("modify order");
}

function deleteTheOrder() {
  console.log("delete the order!");
}

function deleteAllOrders() {
  console.log("delete All orders!");
}

function getTableList() {
  let tableData = {};
  orderData.forEach(
    ({ createdAt, id: prdId, paid, products, updatedAt, user }) => {
      const prdList = products.map(({ title }) => title);
      const { name, address, email } = user;

      tableData = {
        prdList,
        name,
        address,
        email,
        time: updatedAt ? updatedAt : createdAt,
        paid,
      };
    }
  );

  console.log("===>", tableData);
}

function getChart() {
  let calRsult = {};
  orderData.forEach(({ products }) => {
    products.map(({ title }) => {
      if (calRsult[title]) calRsult[title] += 1;
      else calRsult[title] = 1;
    });
  });

  let chartData = [];
  Object.keys(calRsult).forEach((key) => chartData.push([key, calRsult[key]]));
  console.log(chartData);

  // C3.js
  let chart = c3.generate({
    bindto: "#chart", // HTML 元素綁定
    data: {
      type: "pie",
      columns: chartData,
      colors: {
        "Louvre 雙人床架": "#DACBFF",
        "Antony 雙人床架": "#9D7FEA",
        "Anty 雙人床架": "#5434A7",
        其他: "#301E5F",
      },
    },
  });
}

function render() {
  getChart();
  getTableList();
}

// main
getOrderList();
