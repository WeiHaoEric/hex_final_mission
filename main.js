// API Settings
const token = "8bFJuwEs59bafozvolCBdtJYXSu1";
const api_path = "xiaoweieric";
const SERVER_URL = `https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_path}/orders`;

// Data
let orderData = null;

// func
function getOrderList() {
  // console.log("get order list");
  axios
    .get(SERVER_URL, {
      headers: {
        Authorization: token,
      },
    })
    .then((resp) => {
      // console.log("===>", resp.data);
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

function deleteTheOrder(prdId) {
  let itemDom = document.querySelectorAll(`.del-btn`);

  itemDom.forEach((dom) => {
    console.log(dom.className);
    dom.addEventListener("click", (event) => {
      console.log(`delete the id-${dom.className}!`);

      const sliceIdx = dom.className.search("@");
      const orderId = dom.className.slice(sliceIdx + 1);

      axios
        .delete(`${SERVER_URL}/${orderId}`, {
          headers: {
            Authorization: token,
          },
        })
        .then((resp) => {
          const { status, message } = resp;
          if (status) getOrderList();
          console.log(message);
        })
        .catch((err) => console.log("err:", err));
    });
  });
}

function deleteAllOrders() {
  let cleanAllDom = document.querySelector(".discardAllBtn");
  console.log(cleanAllDom);
  cleanAllDom.addEventListener("click", (event) => {
    // console.log("delete All orders!");
    axios
      .delete(SERVER_URL, {
        headers: {
          Authorization: token,
        },
      })
      .then((resp) => {
        const { status, message } = resp;
        if (status) getOrderList();
        console.log(message);
      })
      .catch((err) => console.log("err:", err));
  });
}

function getTableList() {
  // get Table Dom
  let tableDom = document.querySelector(".orderPage-table");

  // head
  let domContext = `
    <thead>
      <tr>
        <th>????????????</th>
        <th>?????????</th>
        <th>????????????</th>
        <th>????????????</th>
        <th>????????????</th>
        <th>????????????</th>
        <th>????????????</th>
        <th>??????</th>
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

  // console.log("===>", tableData);
  tableData.forEach(
    ({ prdId, prdList, phone, name, address, email, time, paid }) => {
      const tmp = `
      <tr }>
        <td>${prdId}</td>
        <td>
          <p>${name}</p>
          <p>${phone}</p>
        </td>
        <td>${address}</td>
        <td>${email}</td>
        <td>
          ${prdList.reduce((accum, prd) => accum + `<p>${prd}</p>`, "")}
        </td>
        <td>${new Date(time * 1000).toLocaleDateString("cn-TW")}</td>
        <td class="orderStatus">
          <a href="#">${paid ? "?????????" : "?????????"}</a>
        </td>
        <td>
          <input type="button" class="${`del-btn id@${prdId}`}" value="??????" />
        </td>
      </tr>
      `;

      domContext += tmp;
    }
  );

  tableDom.innerHTML = domContext;
}

function getChart() {
  let calResult = {};
  orderData.forEach(({ products }) => {
    products.forEach(({ title, quantity, price }) => {
      if (calResult[title]) calResult[title] += quantity * price;
      else calResult[title] = quantity * price;
    });
  });

  console.log("===>calRsult", calResult);

  // sort object
  const sortPriceList = Object.values(calResult).sort((a, b) => b - a);
  // console.log("===>sortPriceList", sortPriceList);
  const [top1, top2, top3, ...others] = sortPriceList;
  console.log(top1, top2, top3, others);

  // sort by top1~3 and others
  let chartData = [];
  [top1, top2, top3].map((targetPrice) => {
    Object.keys(calResult).map((key, idx) => {
      if (calResult[key] === targetPrice) {
        chartData.push([key, targetPrice]);
        delete calResult[key];

      };
    });
  });

  const otherPrice = others.reduce((accum,price)=>accum+price,0)
  chartData.push(["others", otherPrice]);
  console.log(chartData);


  // C3.js
  let chart = c3.generate({
    bindto: "#chart", // HTML ????????????
    data: {
      type: "pie",
      columns: chartData,
      colors: {
        "Louvre ????????????": "#DACBFF",
        "Antony ????????????": "#9D7FEA",
        "Anty ????????????": "#5434A7",
        ??????: "#301E5F",
      },
    },
  });
}

function render() {
  getChart();
  getTableList();
  deleteAllOrders();
  deleteTheOrder();
}

// main
getOrderList();
