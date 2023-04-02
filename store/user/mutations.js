export default {
  addUser(state, object) {
    state.online = true;
    state.name = object.name;
    state.email = object.email;
    state.token = object.token;
  },
  deleteUser(state) {
    state.online = false;
    state.name = "";
    state.email = "";
    state.token = "";
  },
};
