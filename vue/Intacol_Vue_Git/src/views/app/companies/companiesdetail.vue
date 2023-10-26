<template>
  <div class="main-content">
    <breadcumb :page="'Company Add/Edit'" :folder="'Companies'" />
    <b-row>
      <b-overlay :show="showoverlay" rounded="sm">
        <b-col md="12 mb-30">
          <b-card :title="addEditTitle">
            <b-form @submit.prevent="formSubmit">
              <b-row>
                <b-form-group
                  class="col-md-6 mb-3"
                  label="Company Name"
                  label-for="input-1"
                >
                  <b-form-input
                    v-model="form.name"
                    type="text"
                    placeholder="Company Name"
                    required
                    :state="nameState"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  class="col-md-6 mb-3"
                  label="Company Fullname"
                  label-for="input-1"
                >
                  <b-form-input
                    v-model="form.full_name"
                    type="text"
                    placeholder="Company Fullname"
                    required
                    :state="full_nameState"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  class="col-md-6 mb-3"
                  label="Company Address"
                  label-for="input-1"
                >
                  <b-form-textarea
                    id="textarea"
                    v-model="form.address"
                    required
                    :state="addressState"
                    placeholder="Company Address"
                    rows="3"
                    max-rows="6"
                  ></b-form-textarea>
                </b-form-group>

                <b-form-group
                  class="col-md-6 mb-3"
                  label="Representative Name"
                  label-for="input-1"
                >
                  <b-form-input
                    v-model="form.manager_name"
                    type="text"
                    placeholder="Representative Name"
                    required
                    :state="manager_nameState"
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
                    placeholder="Representative Phone"
                    required
                    :state="manager_phoneState"
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
                    placeholder="Representative Email"
                    required
                    :state="manager_emailState"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  class="col-md-6 mb-3"
                  label="Company Phone"
                  label-for="input-1"
                >
                  <b-form-input
                    v-model="form.phone"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    type="number"
                    maxlength="10"
                    placeholder="Company Phone"
                    required
                    :state="phoneState"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  class="col-md-6 mb-3"
                  label="Company Email"
                  label-for="input-1"
                >
                  <b-form-input
                    v-model="form.email"
                    type="email"
                    placeholder="Company Email"
                    required
                    :state="emailState"
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
const token = localStorage.getItem("token");
import { toasterNotificationMixin } from "./../../../mixins/create-toast-mixin";

export default {
  mixins: [toasterNotificationMixin],
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: "Add/Edit Company",
  },

  data() {
    return {
      addEditTitle: "Add Company",
      errorTitle: "",
      errorMsg: [],
      form: {
        id: 0,
        name: "",
        address: "",
        email: "",
        address: "",
        phone: "",
        manager_name: "",
        manager_phone: "",
        manager_email: "",
        status: true,
      },
    };
  },

  validations: {
    form: {
      // name: { required },
      // email: { required },
      // phone: { required },
      // full_name: { required },
      // manager_email: { required },
      // manager_name: { required },
      // manager_phone: { required },
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

    full_nameState() {
      if (this.form.full_name == "" || this.form.full_name == null) {
        return false;
      } else return true;
    },

    addressState() {
      if (this.form.address == "" || this.form.address == null) {
        return false;
      } else return true;
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
  },

  created() {
    if (this.$route.params.id != null) {
      if (Number(this.$route.params.id) > 0) {
        this.showoverlay = true;
        this.addEditTitle = "Edit Company";
        this.form.id = this.$route.params.id;
        this.getbyid();
      } else {
        // Reset our form values
        this.addEditTitle = "Add Company";
        this.form.id = 0;
        this.form.name = "";
        this.form.address = "";
        this.form.email = "";
        this.form.phone = "";
        this.form.manager_name = "";
        this.form.manager_phone = "";
        this.form.manager_email = "";
        this.form.status = true;
      }
    }
  },

  methods: {
    onCancel() {
      this.$router.push("/app/companies/companieslist");
    },

    getbyid() {
      this.$axios
        .get(`${ConfigSetting.apiUrl}` + "companies/" + Number(this.form.id), {
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

      if (valid) {
        const token = localStorage.getItem("token");
        const body = {
          name: this.form.name,
          email: this.form.email,
          full_name: this.form.full_name,
          phone: this.form.phone,
          address: this.form.address,
          manager_email: this.form.manager_email,
          manager_name: this.form.manager_name,
          manager_phone: this.form.manager_phone,
          status: this.form.status === true ? "active" : "inactive",
        };

        if (Number(this.form.id) > 0) {
          this.$axios
            .put(
              `${ConfigSetting.apiUrl}` + "companies/" + Number(this.form.id),
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
            .post(`${ConfigSetting.apiUrl}` + "companies", body, {
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
                this.showErrorMsg("Error Message", res.data.message);
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
  },
};
</script>
