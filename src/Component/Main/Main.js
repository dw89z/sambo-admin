import React from "react";
import "./Main.css";
import Footer from "component/Footer";
import Header from "component/Header";
import Components from "../Content/ContentIndex";
import logo from "../../assets/img/logo.png";
import axios from "axios";
import { postApi } from "../../api";
import qs from "querystring";
import { CLIENT_RENEG_WINDOW } from "tls";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.toggleMenuAxis = this.toggleMenuAxis.bind(this);
    this.handleMode = this.handleMode.bind(this);
    this.setHeaderConfig = this.setHeaderConfig.bind(this);
  }

  state = {
    config: {headers: {}},
    history: this.props.history,
    userInfo: {},
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
    ],
    menuAxis: true,
    mode: "scm",
    mountedComps: [
      {
        id: 1,
        name: "년간계획",
        component: "YearPlan"
      }
    ],
    currentComp: {
      id: 1,
      name: "년간계획",
      component: "YearPlan"
    }
  };

  setHeaderConfig() {
    const getToken = sessionStorage.getItem("token");    
    const headerConfig = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": getToken
      }
    }
    this.setState({
      config : headerConfig
    })
  }

  async getUserInfo() {    
    const getToken = sessionStorage.getItem("token");

    const config = {
        headers: {
        'Access-Control-Allow-Origin': '*',
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${getToken}`
        }
    }

    console.log(config)    

    const data = {
      logid: "system",
      passwd: "11"
    }
    
    console.log(data)
    let response;
    try {
      axios.post("http://125.141.30.222:8757/main/userinfo", null, qs.stringify(data), config).then((res) => {
        console.log('response', res);
      }).catch(err => {
        console.log('catch', err);


      });
    } catch(e) {
      console.log(e);
    }
  }

  getMainMenu() {
    const url = "/main/menu"
    const mainMenuResponse = postApi(url, { params: "" },this.state.config)
    mainMenuResponse.then(res => console.log(res))
  }

  componentDidMount() {
    this.setHeaderConfig()
    setTimeout(() => {
      this.getUserInfo()
      // this.getMainMenu()
    }, 1000);    
  }

  // UI변경을 위한 축(axis) 업데이트
  toggleMenuAxis() {
    const { menuAxis } = this.state;
    this.setState({
      menuAxis: !menuAxis
    });
  }

  // 좌측 메뉴일 경우 클릭한 메뉴 리스트의 클래스 업데이트
  toggleClassParent(e) {
    let parent = e.currentTarget.parentElement;
    parent.classList.toggle("active");
    let subMenu = e.currentTarget.nextElementSibling;
    if (subMenu.style.maxHeight) {
      subMenu.style.maxHeight = null;
    } else {
      subMenu.style.maxHeight = subMenu.scrollHeight + "px";
    }
  }

  // 각 메뉴를 눌렀을 때 탭을 생성 및 추가
  createTabs() {
    const { mountedComps, currentComp } = this.state;
    const { menuAxis } = this.state;

    return (
      <ul className={menuAxis ? "tabs" : "tabs left"}>
        {mountedComps.map((comps, index) => (
          <li
            key={index}
            className={comps.id === currentComp.id ? "tab active" : "tab"}
            onClick={() => this.handleSelect(comps)}
          >
            {comps.name}
            {comps.id === currentComp.id ? (
              <span
                className="delete-btn"
                onClick={e => this.deleteComponent(e, comps.id)}
              ></span>
            ) : (
              <span className="delete-btn disable"></span>
            )}
          </li>
        ))}
      </ul>
    );
  }

  // 각 메뉴를 눌렀을 경우 화면에 컨텐츠를 출력
  createContent() {
    const { mountedComps } = this.state;
    const { currentComp } = this.state;

    // state에서 컴포넌트 이름을 받아 이름에 해당하는 컴포넌트를 호출하는 로직
    const mountedCompsRender = mountedComps.map((comp, index) => {
      let CurrentComp = Components[comp.component];
      return (
        <div
          className={
            comp.id === currentComp.id
              ? "content-inner active"
              : "content-inner"
          }
          key={index}
        >
          <CurrentComp />
        </div>
      );
    });

    return mountedCompsRender;
  }

  // 탭에서 X버튼을 눌렀을때 해당하는 탭과 컴포넌트를 삭제
  deleteComponent(e, id) {
    // 이벤트 전파 방지
    e.stopPropagation();

    // 삭제했을 경우 현재 탭을 이전에 바라보고 있던 탭 화면으로 변경
    const { mountedComps } = this.state;
    const deleteToId = mountedComps.filter(comp => comp.id !== id);
    let previousComp = deleteToId[deleteToId.length - 1];
    this.setState({
      mountedComps: deleteToId,
      currentComp: previousComp
    });
    this.handleSelect(previousComp);
  }

  // 탭을 눌렀을 때 현재 화면을 그 탭의 컨텐츠로 변경
  selectContent(component, name, id) {
    const { mountedComps } = this.state;
    const isMounted = mountedComps.some(comps => comps.id === id);

    const newComp = {
      id,
      component,
      name
    };

    if (isMounted) {
      this.setState({
        currentComp: newComp
      });
    } else {
      this.setState({
        mountedComps: [...mountedComps, newComp],
        currentComp: newComp
      });
    }

    this.createTabs(component, id);
  }

  // 선택창 변경 응용 메소드
  handleSelect(comps) {
    this.setState({
      currentComp: comps
    });
  }

  //업무 모드 변경
  handleMode(e) {
    this.setState({
      mode: e.target.value
    });
  }

  render() {
    const menu = this.state.menu;
    const { menuAxis, mode, history } = this.state;

    return (
      <>
        <Header toggleMenuAxis={this.toggleMenuAxis} history={history} />
        <div className={menuAxis ? "header-menu" : "left-menu"}>
          <div className="select-section">
            <img src={logo} alt="logo" />
            <select
              value={mode}
              onChange={this.handleMode}
              className="mode-selection"
            >
              <option value="scm">SCM 모드</option>
              <option value="admin">관리자 모드</option>
            </select>
          </div>
          <ul className="menu">
            {menu.map((menu, index) => (
              <li className="menu-list" key={index}>
                {menuAxis ? (
                  <p>{menu.menuList}</p>
                ) : (
                  <p onClick={this.toggleClassParent}>{menu.menuList}</p>
                )}

                <ul className="sub-menu">
                  {menu.subList.map((sub, index) => (
                    <li
                      className="sub-menu-list"
                      key={index}
                      onClick={() =>
                        this.selectContent(sub.component, sub.name, sub.id)
                      }
                    >
                      {sub.name}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        {this.createTabs()}
        <div className={menuAxis ? "contents" : "contents left"}>
          {this.createContent()}
        </div>
        <Footer axis={menuAxis} />
      </>
    );
  }
}
