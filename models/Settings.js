const standardInvalidKeys = "createdBy createdAt";

class Settings {
  constructor({
    name = "UNDEFINED",
    invalidCreateKeys = "",
    invalidUpdateKeys = "",
    privacy = "private",
    deleteType = "hard",
    overviewSel = "name",
    overviewPop = [],
    fullSel = "-__v -createdAt -createdBy -slug",
    fullPop = [],
  } = {}) {
    this.name = name;
    this.invalidCreateKeys =
      `${standardInvalidKeys} ${invalidCreateKeys}`.trim();
    this.invalidUpdateKeys =
      `${standardInvalidKeys} ${invalidUpdateKeys}`.trim();
    this.privacy = privacy;
    this.deleteType = deleteType;
    this.overviewSel = overviewSel;
    this.overviewPop = overviewPop;
    this.fullSel = fullSel;
    this.fullPop = fullPop;
  }
}

export default Settings;
