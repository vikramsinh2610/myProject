<template>
  <div class="main-content">
    <breadcumb :page="'Product Add/Edit'" :folder="'Products'" />
    <b-row>
      <b-overlay :show="showoverlay" rounded="sm">
        <b-col md="12 mb-30">
          <b-card :title="addEditTitle">
            <b-form @submit.prevent="formSubmit">
              <b-row>
                <b-form-group
                  class="col-md-6 mb-3"
                  label="Name"
                  label-for="input-1"
                >
                  <b-form-input
                    v-model="form.name"
                    type="text"
                    placeholder="Name"
                    required
                    :state="nameState"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  label="Select Family name"
                  label-for="input-1"
                  class="col-md-6 mb-3"
                >
                  <b-form-select
                    v-model="form.family_id"
                    :options="allFamilies"
                    value-field="id"
                    text-field="name"
                    id="inline-form-custom-select-pref1"
                    class="custom-select-drp"
                    :state="family_idState"
                    required
                  >
                    <template #first>
                      <b-form-select-option :value="0" disabled>
                        Select
                      </b-form-select-option>
                    </template>
                  </b-form-select>
                </b-form-group>

                <b-form-group
                  label="Is Global"
                  label-for="input-1"
                  class="col-md-6"
                >
                  <label class="switch switch-primary mr-3">
                    <input type="checkbox" checked v-model="form.is_global" />
                    <span class="slider"></span>
                  </label>
                </b-form-group>

                <b-form-group
                  label="Is Locked"
                  label-for="input-1"
                  class="col-md-6"
                >
                  <label class="switch switch-primary mr-3">
                    <input type="checkbox" checked v-model="form.is_locked" />
                    <span class="slider"></span>
                  </label>
                </b-form-group>

                <b-form-group
                  label="Nutrients"
                  label-for="input-1"
                  class="col-md-6"
                >
                  <b-form-input
                    v-model="filterValue"
                    type="text"
                    placeholder="Nutrient filter"
                  ></b-form-input>
                </b-form-group>

                <b-form-group class="col-md-12">
                  <!-- <div style="overflow: scroll"> -->
                  <span v-for="(item, i) in filteredNutrients" :key="i">
                    <label class="col-md-2">
                      {{ item.name }} - {{ item.unit }}
                    </label>
                    <input
                      class="col-md-2"
                      type="number"
                      step=".01"
                      placeholder="Value"
                      maxlength="4"
                      oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                      v-model="item.value"
                      @keypress="onlyForCurrency"
                    />
                    <div class="col-md-8"></div>
                  </span>
                  <!-- </div> -->
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
import { toasterNotificationMixin } from "./../../../mixins/create-toast-mixin";
const token = localStorage.getItem("token");
import moment from "moment";

export default {
  mixins: [toasterNotificationMixin],
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: "Add/Edit Product",
  },

  data() {
    return {
      addEditTitle: "Add Product",
      showoverlay: false,
      errorTitle: "",
      errorMsg: [],
      allFamilies: [],
      allNutrients: [],
      filterValue: "",
      form: {
        id: 0,
        name: "",
        family_id: "0",
        is_global: true,
        is_locked: true,
      },
      nutrients: [],
    };
  },

  validations: {
    form: {},
  },

  computed: {
    filteredNutrients() {
      if (this.allNutrients != undefined && this.allNutrients.length > 0) {
        if (this.filterValue != "") {
          return this.allNutrients.filter((item) => {
            return item.name
              .toLowerCase()
              .includes(this.filterValue.toLowerCase());
          });
        } else {
          return this.allNutrients;
        }
      }
    },

    nameState() {
      if (this.form.name == "" || this.form.name == null) {
        return false;
      } else {
        return true;
      }
    },

    family_idState() {
      if (this.form.family_id == "0") {
        return false;
      } else {
        return true;
      }
    },
  },

  created() {
    this.showoverlay = true;
    this.getAllFamilies();
    this.getAllNutrients();
    if (this.$route.params.id != null) {
      if (Number(this.$route.params.id) > 0) {
        this.showoverlay = true;
        this.addEditTitle = "Edit Product";
        this.form.id = this.$route.params.id;
        this.getbyid();
      } else {
        // Reset our form values
        this.addEditTitle = "Add Product";
        this.form.id = 0;
        this.form.name = "";
        this.form.family_id = "0";
        this.form.is_global = 1;
        this.form.is_locked = 1;
      }
    }
  },

  mounted: function () {},

  methods: {
    onlyForCurrency($event) {
      let keyCode = $event.keyCode ? $event.keyCode : $event.which;
      // only allow number and one dot
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        // 46 is dot
        $event.preventDefault();
      }
    },

    onCancel() {
      this.$router.push("/app/products/productslist");
    },

    getbyid() {
      this.showoverlay = true;
      this.$axios
        .get(`${ConfigSetting.apiUrl}` + "products/" + Number(this.form.id), {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            this.form = res.data.data;

            res.data.data.nutrients.forEach((ele) => {
              this.allNutrients.forEach((item) => {
                if (ele.id === item.id) {
                  item["value"] = ele.pivot.units;
                }
              });
            });

            this.form.allFamilies = res.data.data.family.name;
            if (this.form.is_locked === 1) {
              this.form.is_locked = true;
            } else {
              this.form.is_locked = false;
            }
            if (this.form.is_global === 1) {
              this.form.is_global = true;
            } else {
              this.form.is_global = false;
            }
            this.showoverlay = false;
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
            this.onCancel();
            this.showoverlay = false;
          }, 1000);
        });
    },

    formSubmit(e) {
      e.preventDefault();
      let index = 0;
      let valid = true;
      this.errorMsg = [];
      if (this.form.family_id == "0") {
        this.errorMsg.push("The family is required.\n");
      }
      if (this.errorMsg.length > 0) {
        this.showErrorMsg(this.errorMsg);
        valid = false;
      }
      if (valid) {
        const token = localStorage.getItem("token");
        const params = new URLSearchParams();
        params.append("name", this.form.name);
        params.append("family_id", this.form.family_id);
        params.append("is_locked", this.form.is_locked === true ? "1" : "0");
        params.append("is_global", this.form.is_global === true ? "1" : "0");
        this.allNutrients.forEach((item, i) => {
          params.append("nutrients[" + i + "][nutrient_id]", Number(item.id));
          params.append("nutrients[" + i + "][units]", Number(item.value));
          index++;
        });

        this.showoverlay = true;
        if (Number(this.form.id) > 0) {
          this.$axios
            .put(
              `${ConfigSetting.apiUrl}` + "products/" + Number(this.form.id),
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
            .post(`${ConfigSetting.apiUrl}` + "products", params, {
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

    getAllFamilies() {
      this.$axios
        .get(`${ConfigSetting.apiUrl}` + "getAllFamilies", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        .then((res) => {
          this.allFamilies = res.data.data;
        });
    },

    getAllNutrients() {
      this.$axios
        .get(`${ConfigSetting.apiUrl}` + "getAllNutrients", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        .then((res) => {
          this.allNutrients = res.data.data;
          this.allNutrients.forEach((item) => {
            item["value"] = "0.00";
          });
          this.showoverlay = false;
        });
    },
  },
};
</script>