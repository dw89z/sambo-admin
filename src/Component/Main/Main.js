import React from "react";
import "./Main.css";
import Footer from "component/Footer";
import Header from "component/Header";
import Loading from "component/Loading";
import { postApi } from "../../api";
import CreateContent from "../CreateContent";

export default class extends React.Component {
  state = {
    history: this.props.history,
    user: {},
    currentMode: {},
    mode: [],
    currentMenu: [],
    menuAxis: true,
    loading: true
  };

  toggleMenuAxis = () => {
    const { menuAxis } = this.state;
    this.setState({
      menuAxis: !menuAxis
    });
  };

  handleMode = e => {
    this.setState({
      currentMode: {
        main_id: e.target.value
      }
    });
  };

  async componentDidMount() {
    try {
      const {
        data: { data: user }
      } = await postApi("main/userinfo");
      const {
        data: { data: mode }
      } = await postApi("main/mode");

      this.setState({
        user,
        mode,
        currentMode: mode[0]
      });
    } catch {
    } finally {
      this.setState({
        loading: false
      });
    }
  }

  render() {
    const { menuAxis, mode, history, user, currentMode, loading } = this.state;

    return (
      <>
        {loading ? (
          <Loading />
        ) : (
          <>
            <Header
              toggleMenuAxis={this.toggleMenuAxis}
              history={history}
              user={user}
            />

            <div
              className={menuAxis ? "select-section" : "select-section left"}
            >
              <select onChange={this.handleMode} className="mode-selection">
                {mode.map(mode => (
                  <option value={mode.main_id} key={mode.main_id}>
                    {mode.window_name} 모드
                  </option>
                ))}
              </select>
            </div>

            <CreateContent currentMode={currentMode} menuAxis={menuAxis} />

            <Footer axis={menuAxis} />
          </>
        )}
      </>
    );
  }
}
