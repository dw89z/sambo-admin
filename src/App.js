import React from "react";
import Menu from "./Component/Main";

class App extends React.Component {
  state = {
    list: [
      {
        menuList: "구매계획",
        subList: ["년간계획", "월간계획"]
      },
      {
        menuList: "납입지시",
        subList: ["주간납입지시", "출발처리", "납입카드 발행", "출발취소"]
      },
      {
        menuList: "납입정보",
        subList: [
          "품목정보",
          "발주현황",
          "납입현황",
          "출하계획현황",
          "납입준수현황"
        ]
      },
      {
        menuList: "검수정보",
        subList: ["검수현황", "소급현황", "정기검사현황"]
      },
      {
        menuList: "대금지급",
        subList: ["채권/채무현황"]
      },
      {
        menuList: "업체현황",
        subList: ["업체일반", "BOM조회"]
      },
      {
        menuList: "협력업체 ERP",
        subList: ["품목현황", "BOM현황", "재고현황"]
      },
      {
        menuList: "임가공 현황",
        subList: ["수불명세서", "재고현황", "불량등록", "불량현황"]
      }
    ]
  };

  render() {
    const menu = this.state;
    return (
      <>
        <Menu menu={menu} />
      </>
    );
  }
}

export default App;
