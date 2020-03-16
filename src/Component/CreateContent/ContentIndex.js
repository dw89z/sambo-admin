let Components = {};

Components["Dashboard"] = require("./Dashboard/index/index").default;
Components["StckAllList"] = require("./StckAllList/index").default;
Components["StckCurrent"] = require("./StckCurrent/index").default;
Components["StckFailRequest"] = require("./StckFailRequest/index").default;
Components["StckFailStatus"] = require("./StckFailStatus/index").default;
Components["ConfList"] = require("./ConfList/index").default;
Components["ConfException"] = require("./ConfException/index").default;
Components["InfoItemas"] = require("./InfoItemas/index").default;
Components["InfoPurcharse"] = require("./InfoPurcharse/index").default;
Components["InfoSend"] = require("./InfoSend/index").default;
Components["InfoRule"] = require("./InfoRule/index").default;
Components["SendLogistc"] = require("./SendLogistc/index").default;
Components["SendLoprint"] = require("./SendLoprint/index").default;
Components["SendCancel"] = require("./SendCancel/index").default;
Components["PlanYear"] = require("./PlanYear/index").default;
Components["PlanMonth"] = require("./PlanMonth/index").default;
Components["PlanWeek"] = require("./PlanWeek/index").default;
Components["SystUser"] = require("./SystUser/index/index").default;
Components["SystPgm"] = require("./SystPgm/index").default;
Components["SystAuth"] = require("./SystAuth/index").default;
Components["SystNotify"] = require("./SystNotify/index").default;
Components["SystLibrary"] = require("./SystLibrary/index").default;
Components["MastEntry"] = require("./MastEntry/index").default;

export default Components;
