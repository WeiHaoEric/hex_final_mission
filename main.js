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
  // get Table Dom
  let tableDom = document.querySelector(".orderPage-table");

  // head
  let domContext = `
    <thead>
      <tr>
        <th>訂單編號</th>
        <th>聯絡人</th>
        <th>聯絡地址</th>
        <th>電子郵件</th>
        <th>訂單品項</th>
        <th>訂單日期</th>
        <th>訂單狀態</th>
        <th>操作</th>
      </tr>
    </thead>`;

  // parse data for table content
  let tableData = orderData.map(
    ({ createdAt, id: prdId, paid, products, updatedAt, user }) => {
      const prdList = products.map(({ title }) => title);
      const { name, address, email, tel: phone } = user;

      tmp = {
        prdId,
        prdList,
        name,
        phone,
        address,
        email,
        time: updatedAt ? updatedAt : createdAt,
        paid,
      };

      return tmp;
    }
  );

  console.log("===>", tableData);
  tableData.forEach(
    ({ prdId, prdList, phone, name, address, email, time, paid }) => {
      const tmp = `
      <tr>
        <td>${prdId}</td>
        <td>
          <p>${name}</p>
          <p>${phone}</p>
        </td>
        <td>${address}</td>
        <td>${email}</td>
        <td>
          ${prdList.map((prd) => `<p>${prd}</p>`)}
        </td>
        <td>${new Date(time).toLocaleDateString("cn-TW")}</td>
        <td class="orderStatus">
          <a href="#">${paid?"已處理":"未處理"}</a>
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn" value="刪除" />
        </td>
      </tr>
      `;

      domContext+=tmp;
    }
  );

  tableDom.innerHTML = domContext;
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
