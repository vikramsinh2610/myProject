<template>
  <div class="main-content">
    <breadcumb :page="'Stables Add/Edit'" :folder="'Stables'" />
    <b-row>
      <b-overlay :show="showoverlay" rounded="sm">
        <b-col md="12 mb-30">
          <b-card :title="addEditTitle">
            <b-form
              ref="form"
              id="form"
              name="form"
              @submit.prevent="formSubmit"
            >
              <b-row>
                <b-form-group
                  class="col-md-6 mb-3"
                  label="Stable Name"
                  label-for="input-1"
                >
                  <b-form-input
                    v-model="form.name"
                    type="text"
                    required
                    :state="nameState"
                    placeholder="Stable Name"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  class="col-md-6 mb-3"
                  label="Address"
                  label-for="input-1"
                >
                  <b-form-textarea
                    id="textarea"
                    v-model="form.address"
                    required
                    :state="addressState"
                    placeholder="Address"
                    rows="3"
                    max-rows="6"
                  ></b-form-textarea>
                </b-form-group>

                <b-form-group
                  class="col-md-6 mb-3"
                  label="Select Company Name"
                  label-for="input-1"
                >
                  <b-form-select
                    v-model="form.company_id"
                    :options="companylist"
                    value-field="id"
                    text-field="name"
                    :state="company_idState"
                    required
                    id="inline-form-custom-select-pref1"
                    class="custom-select-drp"
                  >
                    <template #first>
                      <b-form-select-option :value="0" disabled>
                        Select
                      </b-form-select-option>
                    </template>
                  </b-form-select>
                </b-form-group>

                <b-form-group
                  class="col-md-6 mb-3"
                  label="Representative Name"
                  label-for="input-1"
                >
                  <b-form-input
                    v-model="form.manager_name"
                    type="text"
                    required
                    :state="manager_nameState"
                    placeholder="Representative Name"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  class="col-md-6 mb-3"
                  label="Representative Phone"
                  label-for="input-1"
                >
                  <b-form-input
                    v-model="form.manager_phone"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    type="number"
                    maxlength="10"
                    required
                    :state="manager_phoneState"
                    placeholder="Representative Phone"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  class="col-md-6 mb-3"
                  label="Representative Email"
                  label-for="input-1"
                >
                  <b-form-input
                    v-model="form.manager_email"
                    type="email"
                    required
                    :state="manager_emailState"
                    placeholder="Representative Email"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  class="col-md-6 mb-3"
                  label="Horse Rider Name"
                  label-for="input-1"
                >
                  <b-form-input
                    v-model="form.rider_name"
                    type="text"
                    required
                    :state="rider_nameState"
                    placeholder="Horse Rider Name"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  class="col-md-6 mb-3"
                  label="Horse Rider Phone"
                  label-for="input-1"
                >
                  <b-form-input
                    v-model="form.rider_phone"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    type="number"
                    maxlength="10"
                    required
                    :state="rider_phoneState"
                    placeholder="Horse Rider Phone"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  class="col-md-6 mb-3"
                  label="Horse Rider Email"
                  label-for="input-1"
                >
                  <b-form-input
                    v-model="form.rider_email"
                    type="email"
                    required
                    :state="rider_emailState"
                    placeholder="Horse Rider Email"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  class="col-md-6 mb-3"
                  label="Stable Email"
                  label-for="input-1"
                >
                  <b-form-input
                    v-model="form.email"
                    type="email"
                    required
                    :state="emailState"
                    placeholder="Stable Email"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  class="col-md-6 mb-3"
                  label="Stable Phone"
                  label-for="input-1"
                >
                  <b-form-input
                    v-model="form.phone"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    type="number"
                    maxlength="10"
                    required
                    :state="phoneState"
                    placeholder="Stable Phone"
                  ></b-form-input>
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

                <b-col md="12" class="mt-3" v-if="form.id > 0">
                  <span>VISITS</span>
                </b-col>

                <b-col md="12" v-if="form.id > 0">
                  <vue-good-table
                    :columns="columns"
                    styleClass="tableOne vgt-table"
                    :rows="stablevisits"
                  >
                    <div slot="table-actions" class="mb-3">
                      <b-button
                        id="btnShow"
                        variant="primary"
                        class="btn-rounded"
                        @click="addNew"
                      >
                        Add New
                      </b-button>
                    </div>

                    <template slot="table-row" slot-scope="props">
                      <span v-if="props.column.field == 'button'">
                        <a v-on:click="onEdit(props.row.id)">
                          <i class="i-Eraser-2 text-25 text-success mr-2"></i>
                        </a>
                        <a v-on:click="onDelete(props.row.id)">
                          <i class="i-Close-Window text-25 text-danger"></i>
                        </a>
                      </span>
                    </template>
                  </vue-good-table>
                </b-col>
              </b-row>
            </b-form>
          </b-card>
        </b-col>
      </b-overlay>
    </b-row>

    <!-- Modal Popup for Schedule a visit -->
    <b-modal id="modal-1" ref="modal-1" hide-footer title="Schedule a visit">
      <b-form
        ref="form2"
        id="form2"
        name="form2"
        @submit.prevent="handleStableVisits"
      >
        <b-form-group
          label="Select who will make the visit"
          label-for="input-1"
        >
          <b-form-select
            v-model="form2.user_id"
            :options="userlist"
            value-field="id"
            text-field="full_name"
            :state="user_idState"
            required
            id="inline-form-custom-select-pref1"
                    class="custom-select-drp"
          >
            <template #first>
              <b-form-select-option :value="0" disabled>
                Select
              </b-form-select-option>
            </template>
          </b-form-select>
        </b-form-group>

        <b-form-group label="Title" label-for="Title-input">
          <b-form-input
            id="Title-input"
            v-model="form2.title"
            required
            :state="titleState"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Visit Purpose" label-for="objective-input">
          <b-form-input
            id="objective-input"
            v-model="form2.objective"
            required
            :state="objectiveState"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Date" label-for="date-input">
          <b-form-datepicker
            id="form2.date"
            v-model="form2.date"
            class="mb-2"
            :state="dateState"
          ></b-form-datepicker>
        </b-form-group>

        <b-button
          class="mt-3"
          type="submit"
          variant="btn btn-primary ripple m-1"
        >
          Submit
        </b-button>

        <b-button
          class="mt-3"
          type="button"
          variant="btn btn-danger ripple m-1"
          id="cancel"
          @click="hideModal"
        >
          Cancel
        </b-button>
      </b-form>
    </b-modal>
  </div>
</template>
<script>
import { ConfigSetting } from "../../../data/config";
import moment from "moment";
import { toasterNotificationMixin } from "./../../../mixins/create-toast-mixin";
const token = localStorage.getItem("token");
import { mapState, mapActions } from "vuex";

export default {
  mixins: [toasterNotificationMixin],
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: "Add/Edit Stable",
  },

  data() {
    return {
      addEditTitle: "Add Stable",
      companylist: [],
      errorTitle: "",
      errorMsg: [],

      columns: [
        {
          label: "Made By",
          field: "user.full_name",
          sortable: true,
        },
        {
          label: "Visit Purpose",
          field: "objective",
          sortable: true,
        },
        {
          label: "Date",
          field: "date",
          sortable: false,
          type: "date",
          formatFn: function (value) {
            return value != null
              ? moment(value, "yyyy-MM-dd HH:mm:ss").format(
                  "d/MM/yyyy HH:mm:ss"
                )
              : null;
          },
        },
        {
          label: "Action",
          field: "button",
          sortable: false,
          html: true,
          tdClass: "text-right",
          thClass: "text-right",
        },
      ],
      stablevisits: [],
      showoverlay: false,
      form: {
        name: "",
        address: "",
        email: "",
        phone: "",
        company_id: 0,
        manager_name: "",
        manager_phone: "",
        manager_email: "",
        rider_name: "",
        rider_phone: "",
        rider_email: "",
        status: true,
      },

      userlist: [],
      form2: {
        id: 0,
        title: "",
        objective: "",
        date: new Date().toISOString().slice(0, 10),
        stable_id: "",
        user_id: "0",
      },
    };
  },

  validations: {
    form: {
      // name: { required },
      // address: { required },
      // email: { required },
      // phone: { required },
      // manager_name: { required },
      // manager_phone: { required },
      // manager_email: { required },
      // rider_name: { required },
      // rider_phone: { required },
      // rider_email: { required },
    },
    form2: {
      // title: { required },
      // objective: { required },
      // date: { required },
    },
  },

  computed: {
    nameState() {
      if (this.form.name == "" || this.form.name == null) {
        return false;
      } else {
        return true;
      }
    },

    company_idState() {
      if (this.form.company_id == "0") {
        return false;
      } else {
        return true;
      }
    },

    addressState() {
      if (this.form.address == "" || this.form.address == null) {
        return false;
      } else return true;
    },

    emailState() {
      if (this.form.email == "" || this.form.email == null) {
        return false;
      } else {
        return true;
      }
    },

    phoneState() {
      if (this.form.phone == "" || this.form.phone == null) {
        return false;
      } else {
        return true;
      }
    },

    manager_emailState() {
      if (this.form.manager_email == "" || this.form.manager_email == null) {
        return false;
      } else {
        return true;
      }
    },

    manager_phoneState() {
      if (this.form.manager_phone == "" || this.form.manager_phone == null) {
        return false;
      } else {
        return true;
      }
    },

    manager_nameState() {
      if (this.form.manager_name == "" || this.form.manager_name == null) {
        return false;
      } else {
        return true;
      }
    },

    rider_emailState() {
      if (this.form.rider_email == "" || this.form.rider_email == null) {
        return false;
      } else {
        return true;
      }
    },

    rider_phoneState() {
      if (this.form.rider_phone == "" || this.form.rider_phone == null) {
        return false;
      } else {
        return true;
      }
    },

    rider_nameState() {
      if (this.form.rider_name == "" || this.form.rider_name == null) {
        return false;
      } else {
        return true;
      }
    },

    //Form 2
    user_idState() {
      if (this.form2.user_id == "0") {
        return false;
      } else {
        return true;
      }
    },

    titleState() {
      if (this.form2.title == "" || this.form2.title == null) {
        return false;
      } else {
        return true;
      }
    },

    objectiveState() {
      if (this.form2.objective == "" || this.form2.objective == null) {
        return false;
      } else {
        return true;
      }
    },

    dateState() {
      if (this.form2.date == "" || this.form2.date == null) {
        return false;
      } else {
        return true;
      }
    },
  },

  created() {
    this.getCompanies();
    this.getUsers();
    if (this.$route.params.id != null) {
      if (Number(this.$route.params.id) > 0) {
        this.showoverlay = true;
        this.addEditTitle = "Edit Stable";
        this.form.id = this.$route.params.id;
        this.getbyid();
      } else {
        // Reset our form values
        this.addEditTitle = "Add Stable";
        this.form.id = 0;
        this.form.name = "";
        this.form.address = "";
        this.form.email = "";
        this.form.phone = "";
        this.form.company_id = "0";
        this.form.manager_name = "";
        this.form.manager_phone = "";
        this.form.manager_email = "";
        this.form.rider_name = "";
        this.form.rider_phone = "";
        this.form.rider_email = "";
        this.form.status = true;
      }
    }
  },

  methods: {
    // format(value, event) {
    //   this.form2.date = moment(value).format("YYYY-MM-DD hh:mm:ss");
    //   return value;
    // },

    resetform2() {
      this.form2.title = "";
      this.form2.objective = "";
      this.form2.date = new Date().toISOString().slice(0, 10);
      this.form2.stable_id = "";
      this.form2.user_id = "0";
    },

    addNew() {
      this.form2.id = 0;
      this.showModal();
    },

    showModal() {
      //Reset Form
      if (this.form2.id === 0 || this.form2.id === "0") {
        this.resetform2();
      }
      this.$root.$emit("bv::show::modal", "modal-1", "#btnShow");
    },

    hideModal() {
      this.$refs["modal-1"].hide();
    },

    handleStableVisits() {
      let valid = true;
      this.errorMsg = [];

      if (this.form2.user_id == "0") {
        this.errorMsg.push("User is required.");
      }

      if (this.errorMsg.length > 0) {
        this.showErrorMsg(this.errorMsg);
        valid = false;
      }

      if (valid) {
        this.showoverlay = true;
        const token = localStorage.getItem("token");
        const body = {
          title: this.form2.title,
          objective: this.form2.objective,
          date: moment(this.form2.date).format("YYYY-MM-DD hh:mm:ss"),
          user_id: this.form2.user_id,
          stable_id: this.form.id,
        };

        this.hideModal();
        if (Number(this.form2.id) > 0) {
          this.$axios
            .put(
              `${ConfigSetting.apiUrl}` + "stableVisits/" + this.form2.id,
              body,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
              }
            )
            .then((res) => {
              if (res.data.success) {
                this.showSuccessMsg(res.data.message);
                setTimeout(() => {
                  this.getbyid();
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
                this.getbyid();
              }, 1000);
            });
        } else {
          this.$axios
            .post(`${ConfigSetting.apiUrl}` + "stableVisits", body, {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            })
            .then((res) => {
              if (res.data.success) {
                this.showSuccessMsg(res.data.message);
                setTimeout(() => {
                  this.getbyid();
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
                this.getbyid();
              }, 1000);
            });
        }
      }
    },

    onCancel() {
      this.$router.push("/app/stables/stableslist");
    },

    getbyid() {
      this.$axios
        .get(`${ConfigSetting.apiUrl}` + "stables/" + Number(this.form.id), {
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

            this.stablevisits = res.data.data.visits;
          } else {
            this.showErrorMsg(res.data.message);
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

      if (this.form.company_id == "0") {
        this.errorMsg.push("The Company is required.");
      }

      if (this.errorMsg.length > 0) {
        this.showErrorMsg(this.errorMsg);
        valid = false;
      }

      if (valid) {
        this.showoverlay = true;
        const token = localStorage.getItem("token");
        const body = {
          name: this.form.name,
          address: this.form.address,
          email: this.form.email,
          phone: this.form.phone,
          company_id: this.form.company_id,
          manager_name: this.form.manager_name,
          manager_phone: this.form.manager_phone,
          manager_email: this.form.manager_email,
          rider_name: this.form.rider_name,
          rider_phone: this.form.rider_phone,
          rider_email: this.form.rider_email,
          status: this.form.status === true ? "active" : "inactive",
        };

        if (Number(this.form.id) > 0) {
          this.$axios
            .put(
              `${ConfigSetting.apiUrl}` + "stables/" + Number(this.form.id),
              body,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
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
            .post(`${ConfigSetting.apiUrl}` + "stables", body, {
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

    getCompanies() {
      this.$axios
        .get(`${ConfigSetting.apiUrl}` + "companies", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        .then((res) => {
          this.companylist = res.data.data;
        });
    },

    getUsers() {
      this.$axios
        .get(`${ConfigSetting.apiUrl}` + "users", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        .then((res) => {
          this.userlist = res.data.data;
        });
    },

    onEdit(id) {
      this.showoverlay = true;
      this.$axios
        .get(`${ConfigSetting.apiUrl}` + "stableVisits/" + Number(id), {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            debugger;
            this.form2 = res.data.data;
            this.form2.id = id;
            this.date = this.form2.date;
            this.showModal();
          } else {
            alert(res.data.message);
          }

          this.showoverlay = false;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    onDelete(id) {
      this.showoverlay = true;
      this.$bvModal
        .msgBoxConfirm("Are you sure, do you want to delete this record?")
        .then((value) => {
          if (value) {
            this.showoverlay = true;
            this.userslist = [];

            this.$axios
              .delete(`${ConfigSetting.apiUrl}` + "stableVisits" + "/" + id, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
              })
              .then((res) => {
                this.getbyid();
              });
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },
  },
};
</script>
