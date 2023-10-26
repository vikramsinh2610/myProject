<template>
  <div class="main-content">
    <breadcumb :page="'User Add/Edit'" :folder="'Users'" />
    <b-row>
      <b-overlay :show="showoverlay" rounded="sm">
        <b-col md="12 mb-30">
          <b-card :title="addEditTitle">
            <b-form @submit.prevent="formSubmit">
              <b-row>
                <b-form-group
                  class="col-md-6 mb-3"
                  label="User Name"
                  label-for="input-1"
                >
                  <b-form-input
                    v-model="form.user_name"
                    type="text"
                    placeholder="User Name"
                    required
                    :state="user_nameState"
                    autocomplete="false"
                  ></b-form-input>
                  <!-- <b-form-invalid-feedback id="input-live-feedback">
                    Username is required
                  </b-form-invalid-feedback> -->
                </b-form-group>

                <b-form-group
                  class="col-md-6 mb-3"
                  label="Full Name"
                  label-for="input-1"
                >
                  <b-form-input
                    v-model="form.full_name"
                    type="text"
                    placeholder="Full Name"
                    required
                    :state="full_nameState"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  class="col-md-6 mb-3"
                  label="Email"
                  label-for="input-1"
                >
                  <b-form-input
                    v-model="form.email"
                    type="email"
                    placeholder="Email"
                    required
                    :state="emailState"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  class="col-md-6 mb-3"
                  label="Password"
                  label-for="input-1"
                  v-if="form.id === 0"
                >
                  <b-form-input
                    v-model="form.password"
                    type="password"
                    placeholder="Password"
                    min="8"
                    :state="passwordState"
                    :disabled="form.id > 0 ? true : false"
                    required
                  ></b-form-input>
                  <b-form-invalid-feedback id="input-live-feedback">
                    Password required min 8 characters
                  </b-form-invalid-feedback>
                </b-form-group>

                <b-form-group
                  label="Select User Role"
                  label-for="input-1"
                  class="col-md-6"
                >
                  <b-form-select
                    v-model="form.role"
                    :options="userRoles"
                    value-field="name"
                    text-field="name"
                    id="inline-form-custom-select-pref1"
                    class="custom-select-drp"
                    :state="roleState"
                    required
                  >
                    <template #first>
                      <b-form-select-option :value="0" disabled>
                        Select
                      </b-form-select-option>
                    </template>
                  </b-form-select>
                  <!-- <b-form-invalid-feedback id="input-live-feedback">
                    Role is required
                  </b-form-invalid-feedback> -->
                </b-form-group>

                <b-form-group
                  label="Activate at"
                  label-for="input-1"
                  class="col-md-6"
                >
                  <b-form-datepicker
                    id="form.activated_at"
                    v-model="form.activated_at"
                    class="mb-2"
                    :state="activated_atState"
                    required
                  ></b-form-datepicker>
                </b-form-group>

                <b-form-group
                  label="Status"
                  label-for="input-1"
                  class="col-md-6"
                >
                  <label class="switch switch-primary mr-3">
                    <input type="checkbox" checked v-model="form.status" />
                    <span class="slider"></span>
                  </label>
                </b-form-group>

                <b-form-group
                  label="Permissions"
                  label-for="input-1"
                  class="col-md-12"
                ></b-form-group>
                <div
                  v-for="data in userPermissions"
                  :key="data.id"
                  class="col-md-6"
                >
                  <span
                    ><b>{{ data.table_name }} <br /></b
                  ></span>

                  <span v-for="item in data.permissions" :key="item.id">
                    <input
                      type="checkbox"
                      :value="item.id"
                      :id="item.id"
                      v-model="form.permissionsdata"
                    />
                    &nbsp;
                    <label :for="item.id">
                      {{ item.name }}
                    </label>
                    <br />
                  </span>

                  <!-- <b-form-checkbox-group
                    id="checkbox-group"
                    v-model="form.permissionsdata"
                    name="form.permissionsdata"
                  >
                    <b-form-checkbox
                      v-for="perm in data.permissions"
                      :key="perm.id"
                      :value="perm.id"
                      :name="perm.name"
                      @input="filterTable"
                    >
                      {{ perm.name }}
                    </b-form-checkbox>
                  </b-form-checkbox-group> -->
                </div>

                <b-col md="12">
                  <b-button
                    class="mt-3"
                    type="submit"
                    variant="btn btn-primary ripple m-1"
                    >Submit</b-button
                  >
                  <b-button
                    class="mt-3"
                    type="submit"
                    v-on:click="onCancel"
                    variant="btn btn-danger ripple m-1"
                    >Cancel</b-button
                  >
                </b-col>
              </b-row>
            </b-form>
          </b-card>
        </b-col>
      </b-overlay>
    </b-row>
  </div>
</template>
<script>
import { ConfigSetting } from "../../../data/config";
import { toasterNotificationMixin } from "./../../../mixins/create-toast-mixin";
const token = localStorage.getItem("token");
import { mapState, mapActions } from "vuex";
import moment from "moment";

export default {
  mixins: [toasterNotificationMixin],
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: "Add/Edit User",
  },

  data() {
    return {
      addEditTitle: "Add User",
      hidePwd: true,
      showoverlay: false,
      errorTitle: "",
      errorMsg: [],
      userRoles: [],
      userPermissions: [],
      // date: "",
      form: {
        id: 0,
        user_name: "",
        full_name: "",
        email: "",
        password: "",
        activated_at: new Date().toISOString().slice(0, 10),
        image: "",
        status: true,
        role: "0",
        permissionsdata: [],
        permissions: [],
      },
    };
  },

  validations: {
    form: {
      // user_name: { required },
      // full_name: { required },
      // email: { required },
      // password: { required, minLength: 8 },
    },
  },

  computed: {
    user_nameState() {
      if (this.form.user_name == "" || this.form.user_name == null) {
        return false;
      } else {
        return true;
      }
    },

    full_nameState() {
      if (this.form.full_name == "" || this.form.full_name == null) {
        return false;
      } else {
        return true;
      }
    },

    emailState() {
      if (this.form.email == "" || this.form.email == null) {
        return false;
      } else {
        return true;
      }
    },

    passwordState() {
      if (this.form.password == "" || this.form.password == null) {
        return false;
      } else {
        if (this.form.password.length < 8) return false;
        else return true;
      }
    },

    activated_atState() {
      if (this.form.activated_at == "" || this.form.activated_at == null) {
        return false;
      } else {
        return true;
      }
    },

    roleState() {
      if (this.form.role == "0") {
        return false;
      } else {
        return true;
      }
    },
  },

  created() {
    this.showoverlay = true;
    this.getAllRoles();
    this.getAllPermissions();
    if (this.$route.params.id != null) {
      if (Number(this.$route.params.id) > 0) {
        this.showoverlay = true;
        this.addEditTitle = "Edit User";
        this.form.id = this.$route.params.id;
        this.hidePwd = false;
        this.getbyid();
      } else {
        // Reset our form values
        this.addEditTitle = "Add User";
        this.form.id = 0;
        this.form.user_name = "";
        this.form.full_name = "";
        this.form.email = "";
        this.form.password = "";
        this.form.activated_at = new Date().toISOString().slice(0, 10);
        this.form.image = "";
        this.form.status = true;
        this.form.role = "0";
        this.form.permissionsdata = [];
      }
    }
  },

  mounted: function () {},

  methods: {
    filterTable() {
      console.log(this.form.permissionsdata);
      this.for;
    },
    onCancel() {
      this.$router.push("/app/users/userslist");
    },

    getbyid() {
      this.$axios
        .get(`${ConfigSetting.apiUrl}` + "users/" + Number(this.form.id), {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            this.form = res.data.data;
            if (this.form.status === "active") {
              this.form.status = true;
            } else {
              this.form.status = false;
            }

            this.form.role = res.data.data.roles[0].name;
            if (
              res.data.data.permissions != null &&
              res.data.data.permissions.length > 0
            ) {
              this.form.permissionsdata = [];
              for (let i = 0; i < res.data.data.permissions.length; i++) {
                this.form.permissionsdata.push(res.data.data.permissions[i].id);
              }
            }

            this.form.date = moment(res.data.data.date, "YYYY-MM-DD");
          } else {
            this.showErrorMsg(this.errorMsg);
          }
          this.showoverlay = false;
        })
        .catch((error) => {
          this.errorTitle = "Server Error";
          if (error.response) {
            if (error.response.status === 404) {
              this.errorMsg = error.response.statusText;
            } else if (error.response.status === 422) {
              console.log(error.response.data);
              this.errorTitle = error.response.data.message;
              if (error.response.data.errors != undefined) {
                this.errorMsg = error.response.data.errors;
              }
            }
          } else if (error.request) {
            console.log(error.request);
            this.errorMsg = error.request;
          } else {
            console.log("Error", error.message);
            this.errorMsg = "Error" + error.message;
          }

          this.showErrorMsg(this.errorMsg);
          setTimeout(() => {
            this.onCancel();
            this.showoverlay = false;
          }, 1000);
        });
    },

    formSubmit(e) {
      e.preventDefault();
      let valid = true;
      this.errorMsg = [];

      if (this.form.role == "0") {
        this.errorMsg.push("The role is required.\n");
      }
      if (this.form.permissionsdata.length === 0) {
        this.errorMsg.push("The permissions is required.\n");
      }
      if (this.form.password.length < 8) {
        this.errorMsg.push("The password must be at least 8 characters.\n");
      }

      if (this.errorMsg.length > 0) {
        this.showErrorMsg(this.errorMsg);
        valid = false;
      }

      if (valid) {
        const token = localStorage.getItem("token");
        const params = new URLSearchParams();
        params.append("user_name", this.form.user_name);
        params.append("full_name", this.form.full_name);
        params.append("email", this.form.email);
        params.append("password", this.form.password);
        params.append(
          "activated_at",
          moment(this.form.activated_at).format("YYYY-MM-DD hh:mm:ss")
        );
        params.append("image", this.form.image);
        params.append(
          "status",
          this.form.status === true ? "active" : "inactive"
        );
        params.append("role", this.form.role);
        if (
          this.form.permissionsdata != undefined &&
          this.form.permissionsdata.length > 0
        ) {
          for (let i = 0; i < this.form.permissionsdata.length; i++) {
            params.append("permissions[]", this.form.permissionsdata[i]);
          }
        }

        this.showoverlay = true;
        if (Number(this.form.id) > 0) {
          this.$axios
            .put(
              `${ConfigSetting.apiUrl}` + "users/" + Number(this.form.id),
              params,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/x-www-form-urlencoded;charset=utf-8",
                },
              }
            )
            .then((res) => {
              if (res.data.success) {
                this.showSuccessMsg(res.data.message);
                setTimeout(() => {
                  this.onCancel();
                }, 1000);
              } else {
                this.showErrorMsg(res.data.message);
                this.showoverlay = false;
              }
            })
            .catch((error) => {
              this.errorTitle = "Server Error";
              if (error.response) {
                if (error.response.status === 404) {
                  this.errorMsg = error.response.statusText;
                } else if (error.response.status === 422) {
                  console.log(error.response.data);
                  this.errorTitle = error.response.data.message;
                  if (error.response.data.errors != undefined) {
                    this.errorMsg = error.response.data.errors;
                  }
                }
              } else if (error.request) {
                console.log(error.request);
                this.errorMsg = error.request;
              } else {
                console.log("Error", error.message);
                this.errorMsg = "Error" + error.message;
              }

              this.showErrorMsg(this.errorMsg);
              setTimeout(() => {
                // this.onCancel();
                this.showoverlay = false;
              }, 1000);
            });
        } else {
          this.$axios
            .post(`${ConfigSetting.apiUrl}` + "users", params, {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            })
            .then((res) => {
              if (res.data.success) {
                this.showSuccessMsg(res.data.message);
                setTimeout(() => {
                  this.onCancel();
                }, 1000);
              } else {
                this.showErrorMsg(res.data.message);
                this.showoverlay = false;
              }
            })
            .catch((error) => {
              this.errorTitle = "Server Error";
              if (error.response) {
                if (error.response.status === 404) {
                  this.errorMsg = error.response.statusText;
                } else if (error.response.status === 422) {
                  console.log(error.response.data);
                  this.errorTitle = error.response.data.message;
                  if (error.response.data.errors != undefined) {
                    this.errorMsg = error.response.data.errors;
                  }
                }
              } else if (error.request) {
                console.log(error.request);
                this.errorMsg = error.request;
              } else {
                console.log("Error", error.message);
                this.errorMsg = "Error" + error.message;
              }

              this.showErrorMsg(this.errorMsg);
              setTimeout(() => {
                // this.onCancel();
                this.showoverlay = false;
              }, 1000);
            });
        }
      }
    },

    getAllRoles() {
      this.$axios
        .get(`${ConfigSetting.apiUrl}` + "getAllRoles", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        .then((res) => {
          this.userRoles = res.data.data;
        });
    },

    getAllPermissions() {
      this.$axios
        .get(`${ConfigSetting.apiUrl}` + "getAllPermissions", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        .then((res) => {
          this.userPermissions = res.data.data;
          this.showoverlay = false;
        });
    },
  },
};
</script>
