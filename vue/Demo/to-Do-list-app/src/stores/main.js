import { defineStore } from "pinia";
import axios from "axios";

export const useMainStore = defineStore("main", {
  state: () => ({
    /* User */
    userName: null,
    userEmail: null,
    userAvatar: null,

    /* Field focus with ctrl+k (to register only once) */
    isFieldFocusRegistered: false,

    /* Sample data (commonly used) */
    clients: [],
    history: [],
    toDoById: {},
    items: []
  }),
  actions: {
    setUser(payload) {

      if (payload.name) {
        this.userName = payload.name;
      }
      if (payload.email) {
        this.userEmail = payload.email;
      }
      if (payload.avatar) {
        this.userAvatar = payload.avatar;
      }
    },

    async fetch(filterType = null) {
      if (filterType == null || filterType == "all" || filterType == "") {
        let response = await axios
          .get(`http://192.168.0.121:8002/api/Tasks/GetAllTasksList`)
          .then((r) => {

            if (r.data) {

              this.items = r.data

            }

          })
          .catch((error) => {
            alert(error.message);
          });
        console.log(response);
      } else if (filterType == 'complete') {
        let response = await axios
          .get(`http://192.168.0.121:8002/api/Tasks/GetAllCompletedTasks`)
          .then((r) => {

            if (r.data) {

              this.items = r.data

            }

          })
          .catch((error) => {
            alert(error.message);
          });
        console.log(response)
      } else if (filterType == 'inProgress') {
        let response = await axios
          .get(`http://192.168.0.121:8002/api/Tasks/GetAllUnCompletedTasks`)
          .then((r) => {

            if (r.data) {

              this.items = r.data

            }

          })
          .catch((error) => {
            alert(error.message);
          });
        console.log(response)
      }


    },
    async getDataById(id) {
      console.log("Get data by id =", id);
      try {
        let params = new URLSearchParams();
        params.append("id", id);

        let result = await axios.get('http://192.168.0.121:8002/api/Tasks/GetTaskById/', { params })

        this.toDoById = result.data
      } catch (e) {
        console.log("Error getting data by Id : ", e.message)
      }


    },
    async saveToDoData(data) {
      console.log("Save data", data)
      try {
        await axios.post("http://192.168.0.121:8002/api/Tasks/SaveTasks/",
          data);
      } catch (e) {
        console.log("Error saving data : ", e.message);
      }

    },
    async userLogin(data) {
      console.log("save data vikram");
      try {
        await axios.post("http://192.168.0.121:8002/api/Account/UserLogin",
          data);
      } catch (e) {
        console.log("Error saving data : ", e.message);
      }
    },
    async deleteToDo(clientId) {

      try {
        let response = await axios.delete("http://192.168.0.121:8002/api/Tasks/DeleteTaskById?id=" + clientId);
        console.log(response)
      } catch (e) {
        console.log("Error deleting task : ", e.message);
      }

    },
    async changeStatusToComplete(clientId) {
      try {
        let response = await axios.get("http://192.168.0.121:8002/api/Tasks/MarkIsCompletedById?id=" + clientId)
        console.log(response)
      } catch (e) {
        console.log("Error changing the status : ", e.message)
      }

    }
  },
});
