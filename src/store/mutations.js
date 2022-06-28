const mutations = {
  SETCOLLECTION(state,value) {
    state.collection = value;
  },
  SETCHECKOBJ(state,value) {
    state.checkObj = value;
  },
  SETBORDEROBJ(state,value) {
    state.borderObj = value;
  },
  SETCHECKID(state,value) {
    state.checkId = value;
  },
  SETCOLER(state,value) {
    state.color = value;
  },
  SETANALYSE(state,value) {
    state.analyse = value;
  },
  SETSCATTERIDS(state,value) {
    state.scatterIds = value;
  },
  SETDATASETDATE(state,value) {
    state.dataSetid = value;
  }
}

export default mutations