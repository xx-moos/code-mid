import { Model, attr, fk } from "redux-orm";

class App extends Model {
  static modelName = "App";

  static get fields() {
    return {
      id: attr({ getDefault: () => 0 }),
      isLoading: attr({ getDefault: () => false }),
      user: attr(),
      token: attr(),
    };
  }

  static types = {
    showLoader: (payload) => ({
      type: "APP/SHOW_LOADER",
      payload,
    }),
    hideLoader: (payload) => ({
      type: "APP/HIDE_LOADER",
      payload,
    }),
    update: (payload) => ({
      type: "APP/UPDATE",
      payload,
    }),
    signUp: (payload) => ({
      type: "APP/SIGN_UP",
      payload,
    }),
    signIn: (payload) => ({
      type: "APP/SIGN_IN",
      payload,
    }),
    signOut: (payload) => ({
      type: "APP/SIGN_OUT",
      payload,
    }),
    sendResetPasswordEmail: (payload) => ({
      type: "APP/SEND_RESET_PASSWORD_EMAIL",
      payload,
    }),
    resetPassword: (payload) => ({
      type: "APP/RESET_PASSWORD",
      payload,
    }),
    sendReview: (payload) => ({
      type: "APP/SEND_REVIEW",
      payload,
    }),
  };

  static reducer(action, App, session) {
    const app = App.all().first() || App.create({});

    switch (action.type) {
      case this.types.showLoader().type:
        app.update({ isLoading: true });
        break;
      case this.types.hideLoader().type:
        app.update({ isLoading: false });
        break;
      case this.types.update().type:
        app.update({ ...action.payload });
        break;
      case this.types.signUp().type:
        break;
      case this.types.signIn().type:
        break;
      case this.types.sendResetPasswordEmail().type:
        break;
      case this.types.resetPassword().type:
        break;
      case this.types.signOut().type:
        app.update({ user: undefined, token: undefined });
        break;
    }
  }

  static selectors = {
    getApp: (state) => state.App.itemsById[0],
    isLogged: (state) => state.App.itemsById[0],
    user: (state) => state.App.itemsById[0],
    token: (state) => state.App.itemsById[0],
  };
}

export default App;
