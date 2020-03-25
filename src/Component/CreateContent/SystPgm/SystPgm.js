import React from "react";
import Loading from "../../Loading";
import { postApi, putApi, getApi } from "../../../api";
import "./SystPgm.scss";

export default class extends React.Component {
  state = {
    loading: false,
    data: []
  };

  tree = {
    treeStr: data => {
      return (
        <>
          {data.map((main, index) => {
            return (
              <ul className="main-depth" key={index}>
                <li
                  key={index}
                  data-lvlno={main.program.lvlno}
                  data-mainid={main.program.main_id}
                  data-sub1id={main.program.sub1_id}
                  data-sub2id={main.program.sub2_id}
                >
                  <p onClick={this.tree.toggleClass}>
                    {main.program.window_name}
                  </p>
                  <ul className="sub-depth">
                    {main.sublist.map((sublist, index) => {
                      return (
                        <li
                          key={index}
                          data-lvlno={sublist.program.lvlno}
                          data-mainid={sublist.program.main_id}
                          data-sub1id={sublist.program.sub1_id}
                          data-sub2id={sublist.program.sub2_id}
                        >
                          <p onClick={this.tree.toggleSubClass}>
                            {sublist.program.window_name}
                          </p>
                          <ul className="last-depth">
                            {sublist.sublist.map((last, index) => {
                              return (
                                <li
                                  key={index}
                                  data-lvlno={last.lvlno}
                                  data-mainid={last.main_id}
                                  data-sub1id={last.sub1_id}
                                  data-sub2id={last.sub2_id}
                                >
                                  <p>{last.window_name}</p>
                                </li>
                              );
                            })}
                          </ul>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              </ul>
            );
          })}
        </>
      );
    },

    toggleClass: e => {
      let subMenu = e.currentTarget.nextElementSibling;
      if (subMenu.style.maxHeight) {
        subMenu.style.maxHeight = null;
      } else {
        subMenu.style.maxHeight = subMenu.scrollHeight + "px";
      }
    },

    toggleSubClass: e => {
      let subMenu = e.currentTarget.nextElementSibling;
      let parent = subMenu.parentElement.parentElement;
      let parentHeight = parseInt(parent.style.maxHeight);
      if (subMenu.style.maxHeight) {
        subMenu.style.maxHeight = null;
      } else {
        subMenu.style.maxHeight = subMenu.scrollHeight + "px";
        let subMenuHeight = parseInt(subMenu.style.maxHeight);
        parent.style.maxHeight = parentHeight + subMenuHeight + "px";
      }
    }
  };

  onNumChange = e => {};
  async componentDidMount() {
    await getApi("admin/pm/programlist").then(res => {
      const {
        data: { data }
      } = res;
      console.log(data);
      this.setState({
        data: data
      });
    });
  }

  render() {
    const { loading, data } = this.state;
    const tree = this.tree;

    return (
      <>
        <div className="content-component syst-pgm">
          <h2>{this.props.title}</h2>
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className="section-wrapper">
                <h5 className="title">프로그램 목록</h5>
                <div className="tree-section">{tree.treeStr(data)}</div>
                <div className="panel">
                  <h5 className="title">프로그램 등록 / 수정</h5>
                  <form onSubmit={this.submitUser}>
                    <div className="input-div">
                      <p>프로그램 구분</p>
                      <div className="radio-section">
                        <div className="radio">
                          <input
                            type="radio"
                            name="auth"
                            id="normal"
                            value="0"
                            onChange={this.inputUpdate}
                            required
                          />
                          <label htmlFor="normal">업무메뉴</label>
                        </div>
                        <div className="radio">
                          <input
                            type="radio"
                            name="auth"
                            id="admin"
                            value="1"
                            onChange={this.inputUpdate}
                            required
                          />
                          <label htmlFor="admin">중분류</label>
                        </div>
                        <div className="radio">
                          <input
                            type="radio"
                            name="auth"
                            id="corop"
                            value="2"
                            onChange={this.inputUpdate}
                            required
                          />
                          <label htmlFor="corop">그로그램</label>
                        </div>
                      </div>
                    </div>

                    <div className="input-div">
                      <p>대분류 코드</p>
                      <input
                        type="num"
                        placeholder="비밀번호를 입력해 주세요"
                        name="passwd"
                        spellCheck="false"
                        autoComplete="off"
                        onChange={this.inputUpdate}
                        required
                      />
                    </div>

                    <div className="input-div">
                      <p>중분류 코드</p>
                      <input
                        type="text"
                        placeholder="중분류 코드를 입력해 주세요"
                        name="cvcod"
                        spellCheck="false"
                        autoComplete="off"
                        onChange={this.inputUpdateCod}
                        required
                      />
                    </div>

                    <div className="input-div">
                      <p>소분류 코드</p>
                      <input
                        type="text"
                        placeholder="소분류 코드를 입력해 주세요"
                        name="cvnas"
                        spellCheck="false"
                        autoComplete="off"
                        onChange={this.inputUpdate}
                        required
                      />
                    </div>

                    <div className="input-div">
                      <p>프로그램명</p>
                      <input
                        type="text"
                        placeholder="거래처명을 입력해 주세요"
                        name="cvnas"
                        spellCheck="false"
                        autoComplete="off"
                        onChange={this.inputUpdate}
                        required
                      />
                    </div>

                    <div className="input-div">
                      <p>WINDOW-ID</p>
                      <input
                        type="tel"
                        placeholder="핸드폰 번호를 입력해 주세요"
                        name="hphone"
                        spellCheck="false"
                        onChange={this.inputUpdate}
                      />
                    </div>

                    <div className="input-div">
                      <p>입출력 구분</p>
                      <div className="radio-section">
                        <div className="radio">
                          <input
                            type="radio"
                            name="auth"
                            id="normal"
                            value="0"
                            onChange={this.inputUpdate}
                            required
                          />
                          <label htmlFor="normal">일반</label>
                        </div>
                        <div className="radio">
                          <input
                            type="radio"
                            name="auth"
                            id="admin"
                            value="1"
                            onChange={this.inputUpdate}
                            required
                          />
                          <label htmlFor="admin">관리자</label>
                        </div>
                        <div className="radio">
                          <input
                            type="radio"
                            name="auth"
                            id="corop"
                            value="2"
                            onChange={this.inputUpdate}
                            required
                          />
                          <label htmlFor="corop">협력사</label>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </>
    );
  }
}
