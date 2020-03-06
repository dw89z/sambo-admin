import React from "react";
import Main from "./Component/Main";
import Login from "./Component/Login";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }
  state = {
    userLogin: false,
    menu: [
      {
        menuList: "구매계획",
        subList: [
          {
            id: 1,
            name: "년간계획",
            component: "YearPlan"
          },
          {
            id: 2,
            name: "월간계획",
            component: "MonthPlan"
          },
          {
            id: 3,
            name: "주간/일 생산계획",
            component: "DailyPlan"
          }
        ]
      },
      {
        menuList: "납입지시",
        subList: [
          {
            id: 4,
            name: "주간납입지시",
            component: "WeeklyOrder"
          },
          {
            id: 5,
            name: "출발처리",
            component: "Departure"
          },
          {
            id: 6,
            name: "납입카드 발행",
            component: "DeliveryPublish"
          },
          {
            id: 7,
            name: "출발취소",
            component: "CancelDeparture"
          }
        ]
      },
      {
        menuList: "납입정보",
        subList: [
          {
            id: 8,
            name: "품목정보",
            component: "GoodsInfo"
          },
          {
            id: 9,
            name: "발주현황",
            component: "OrderStatus"
          },
          {
            id: 10,
            name: "납입현황",
            component: "DeliveryStatus"
          },
          {
            id: 11,
            name: "출하계획현황",
            component: "PlanStatus"
          },
          {
            id: 12,
            name: "납입준수현황",
            component: "ObservationStatus"
          }
        ]
      },
      {
        menuList: "검수정보",
        subList: [
          {
            id: 13,
            name: "검수현황",
            component: "InspectionStatus"
          },
          {
            id: 14,
            name: "소급현황",
            component: "RetroactiveStatus"
          },
          {
            id: 15,
            name: "정기검사현황",
            component: "InspectionRoutine"
          }
        ]
      },
      {
        menuList: "대금지급",
        subList: [
          {
            id: 16,
            name: "채권/채무현황",
            component: "BondDeptStatus"
          }
        ]
      },
      {
        menuList: "업체현황",
        subList: [
          {
            id: 17,
            name: "업체일반",
            component: "GeneralStatus"
          },
          {
            id: 18,
            name: "BOM조회",
            component: "BOMLookup"
          }
        ]
      },
      {
        menuList: "협력업체 ERP",
        subList: [
          {
            id: 19,
            name: "품목현황",
            component: "ItemStatus"
          },
          {
            id: 20,
            name: "BOM현황",
            component: "BOMStatus"
          },
          {
            id: 21,
            name: "재고현황",
            component: "StockStatus"
          }
        ]
      },
      {
        menuList: "임가공 현황",
        subList: [
          {
            id: 22,
            name: "수불명세서",
            component: "Bill"
          },
          {
            id: 23,
            name: "재고현황",
            component: "ProItemStatus"
          },
          {
            id: 24,
            name: "불량등록",
            component: "RegistBad"
          },
          {
            id: 25,
            name: "불량현황",
            component: "BadStatus"
          }
        ]
      }
    ]
  };

  // 부모 컴포넌트(App.js)의 state를 업데이트 하는 함수(자식 컴포넌트에 전달)
  handleLogin(e) {
    e.preventDefault();
    this.setState({
      userLogin: true
    });
  }

  handleLogout() {
    this.setState({
      userLogin: false
    });
  }

  render() {
    const { userLogin, menu } = this.state;
    return (
      <>
        {userLogin ? (
          <Main menu={menu} logout={this.handleLogout} />
        ) : (
          <Login login={this.handleLogin} />
        )}
      </>
    );
  }
}

export default App;
