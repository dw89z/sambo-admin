import React from "react";
import Main from "./Component/Main";

class App extends React.Component {
  state = {
    list: [
      {
        menuList: "구매계획",
        subList: [
          {
            id: 1,
            name: "년간계획",
            comp: "YearPlan"
          },
          {
            id: 2,
            name: "월간계획",
            comp: "MonthPlan"
          }
        ]
      },
      {
        menuList: "납입지시",
        subList: [
          {
            id: 3,
            name: "주간납입지시",
            comp: "WeeklyOrder"
          },
          {
            id: 4,
            name: "출발처리",
            comp: "Departure"
          },
          {
            id: 5,
            name: "납입카드 발행",
            comp: "DeliveryPublish"
          },
          {
            id: 6,
            name: "출발취소",
            comp: "CancelDeparture"
          }
        ]
      },
      {
        menuList: "납입정보",
        subList: [
          {
            id: 7,
            name: "품목정보",
            comp: "GoodsInfo"
          },
          {
            id: 8,
            name: "발주현황",
            comp: "OrderStatus"
          },
          {
            id: 9,
            name: "납입현황",
            comp: "DeliveryStatus"
          },
          {
            id: 10,
            name: "출하계획현황",
            comp: "PlanStatus"
          },
          {
            id: 11,
            name: "납입준수현황",
            comp: "ObservationStatus"
          }
        ]
      },
      {
        menuList: "검수정보",
        subList: [
          {
            id: 12,
            name: "검수현황",
            comp: "InspectionStatus"
          },
          {
            id: 13,
            name: "소급현황",
            comp: "RetroactiveStatus"
          },
          {
            id: 14,
            name: "정기검사현황",
            comp: "InspectionRoutine"
          }
        ]
      },
      {
        menuList: "대금지급",
        subList: [
          {
            id: 15,
            name: "채권/채무현황",
            comp: "BondDeptStatus"
          }
        ]
      },
      {
        menuList: "업체현황",
        subList: [
          {
            id: 13,
            name: "업체일반",
            comp: "GeneralStatus"
          },
          {
            id: 14,
            name: "BOM조회",
            comp: "BOMLookup"
          }
        ]
      },
      {
        menuList: "협력업체 ERP",
        subList: [
          {
            id: 12,
            name: "품목현황",
            comp: "ItemStatus"
          },
          {
            id: 13,
            name: "BOM현황",
            comp: "BOMStatus"
          },
          {
            id: 14,
            name: "재고현황",
            comp: "StockStatus"
          }
        ]
      },
      {
        menuList: "임가공 현황",
        subList: [
          {
            id: 12,
            name: "수불명세서",
            comp: "Bill"
          },
          {
            id: 13,
            name: "재고현황",
            comp: "ProItemStatus"
          },
          {
            id: 14,
            name: "불량등록",
            comp: "RegistBad"
          },
          {
            id: 14,
            name: "불량현황",
            comp: "BadStatus"
          }
        ]
      }
    ]
  };

  render() {
    const menu = this.state;
    return (
      <>
        <Main menu={menu} />
      </>
    );
  }
}

export default App;
