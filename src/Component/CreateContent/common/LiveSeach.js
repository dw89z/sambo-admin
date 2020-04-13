import React from "react";
import { postApi } from "../../../api";

class LiveSearch extends React.Component {
  state = {
    typing: false,
    typingTimeout: 0,
    searchKey: "",
    result: {
      visible: false,
      data: {},
    },
    placeholder: "",
  };

  inputs = {
    update: (e) => {
      this.setState({
        [e.target.name]: e.target.value,
      });
      const value = e.target.value;

      if (this.state.typingTimeout) {
        clearTimeout(this.state.typingTimeout);
      }

      this.setState({
        typingTimeout: setTimeout(async () => {
          if (value !== "") {
            const userId = {
              searchKeyword: value.trim(),
            };
            await postApi("admin/um/searchusers", userId).then((res) => {
              const {
                data: { data },
              } = res;
              this.setState({
                result: {
                  visible: true,
                  data: data,
                },
              });
            });
          } else if (value === "") {
            this.setState({
              result: {
                visible: false,
                data: [],
              },
            });
          }
        }, 300),
      });
    },

    reset: () => {
      this.setState({
        searchKey: "",
        result: {
          visible: false,
          data: {},
        },
      });
    },

    searchId: (e) => {
      const logid = e.currentTarget.getAttribute("data-logid");
      this.props.liveResult(logid);
      this.setState({
        result: {
          visible: false,
          data: [],
        },
        searchKey: logid,
      });
    },
  };

  componentDidMount() {
    this.setState({
      searchKey: this.props.user.logid,
    });
  }

  render() {
    const { searchKey, placeholder, result } = this.state;
    const { isMast, user } = this.props;
    const inputs = this.inputs;

    return (
      <>
        <div className="live-search">
          <input
            className="live-search"
            type="text"
            name="searchKey"
            value={searchKey}
            placeholder={placeholder}
            onChange={inputs.update}
            spellCheck="false"
            autoComplete="off"
            disabled={user.auth === "0" && isMast}
            onKeyDown={(e) => {
              if (e.which === 13) {
                e.preventDefault();
              } else if (e.which === 27) {
                inputs.reset();
              }
            }}
          />
          {result.visible && result.data ? (
            <ul className="result-list">
              <li>
                <span className="list-label">거래처코드</span>
                <span className="list-label">거래처명</span>
              </li>
              {result.data.map((data, index) => {
                return (
                  <li
                    key={index}
                    onClick={inputs.searchId}
                    data-logid={data.logid}
                    data-cvnas={data.cvnas}
                  >
                    <span>{data.logid}</span>
                    <span>{data.cvnas}</span>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </>
    );
  }
}

export default LiveSearch;
