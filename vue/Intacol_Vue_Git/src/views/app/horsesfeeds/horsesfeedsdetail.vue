<template>
  <div class="main-content">
    <breadcumb :page="'Horses Feed Add/Edit'" :folder="'Horses Feed'" />
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
                  label="Feed Name / Description"
                  label-for="input-1"
                >
                  <b-form-input
                    v-model="form.name"
                    type="text"
                    placeholder="Feed Name"
                    required
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  class="col-md-6 mb-3"
                  label="Select Horse Name"
                  label-for="input-1"
                >
                  <b-form-select
                    v-model="form.horse_id"
                    :options="horselist"
                    value-field="id"
                    text-field="name"
                    @change="getsinglehorses()"
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
                  :label="form.class_name"
                  label-for="input-1"
                >
                </b-form-group>

                <b-form-group
                  class="col-md-6 mb-3"
                  :label="form.breed_name"
                  label-for="input-1"
                >
                </b-form-group>

                <b-form-group
                  class="col-md-6 mb-3"
                  :label="form.dob"
                  label-for="input-1"
                >
                </b-form-group>

                <b-form-group
                  class="col-md-6 mb-3"
                  :label="form.last_report"
                  label-for="input-1"
                >
                </b-form-group>
                <b-form-group
                  class="col-md-6 mb-3"
                  :label="form.current_weight"
                  label-for="input-1"
                >
                </b-form-group>
                <b-form-group
                  class="col-md-12 mb-6"
                  label="Comments"
                  label-for="input-1"
                >
                  <b-form-textarea
                    id="textarea"
                    v-model="form.comments"
                    required
                    placeholder="Comments"
                    rows="6"
                    max-rows="6"
                  >
                  </b-form-textarea>
                </b-form-group>
                <b-form-group
                  class="col-md-5 mb-3"
                  label="Products Family"
                  label-for="input-1"
                >
                  <b-form-select
                    v-model="form.family_id"
                    :options="allFamilies"
                    value-field="id"
                    text-field="name"
                    id="family"
                    class="custom-select-drp"
                    :state="family_idState"
                    @change="getProductByFamily()"
                  >
                    <template #first>
                      <b-form-select-option :value="0" disabled>
                        Select
                      </b-form-select-option>
                    </template>
                  </b-form-select>
                </b-form-group>
                <b-form-group
                  class="col-md-5 mb-3"
                  label="Products By Family"
                  label-for="input-1"
                >
                  <b-form-select
                    v-model="form.product_id"
                    :options="productByFamily"
                    value-field="id"
                    text-field="name"
                    id="productbyfamily"
                    class="custom-select-drp"
                    :state="family_idState"
                  >
                    <template #first>
                      <b-form-select-option :value="0" disabled>
                        Select
                      </b-form-select-option>
                    </template>
                  </b-form-select>
                </b-form-group>
                <b-col md="2">
                  <b-button
                    class="mt-3"
                    type="button"
                    v-on:click="getFamilyData"
                    >Add Product
                  </b-button>
                </b-col>
                <b-col md="12">
                  <div
                    v-for="(group, familyId) in groupBySelectedProduct"
                    :key="familyId"
                  >
                    <h2>{{ getFamilyName(familyId) }}</h2>
                    <div v-for="(item, i) in group" :key="i">
                      <b-row>
                        <b-col md="6"> {{ item["product_name"] }}(kg) </b-col>
                        <b-col md="4">
                          <vue-slider v-model="item['value']" />
                        </b-col>
                        <b-col md="1">
                          <b-form-input
                            v-model="item['value']"
                            type="number"
                            placeholder="Qty"
                            min="0"
                            disabled
                          ></b-form-input>
                        </b-col>
                        <b-col md="1">
                          <a @click="removeproduct(item['product_id'])">
                          <i class="i-Close-Window text-25 text-danger"></i>
                        </a>
                        </b-col>
                      </b-row>
                    </div>
                  </div>
                </b-col>
                <b-col md="12">
                  <b-form-group label="Parametors Metabolicos"></b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="Weight(Kg)"></b-form-group>
                </b-col>
                <b-col md="4">
                  <vue-slider v-model="form.weight" />
                </b-col>
                <b-col md="2">
                  <b-form-input
                    v-model="form.weight"
                    type="number"
                    placeholder="Weight"
                    required
                    min="0"
                    disabled
                  ></b-form-input>
                </b-col>
                <b-col md="6">
                  <b-form-group label="Dry matter(Kg)"></b-form-group>
                </b-col>
                <b-col md="4">
                  <vue-slider v-model="form.dry_matter" />
                </b-col>
                <b-col md="2">
                  <b-form-input
                    v-model="form.dry_matter"
                    type="number"
                    placeholder="Dry matter"
                    required
                    min="0"
                    disabled
                  ></b-form-input>
                </b-col>
                <b-col md="6">
                  <b-form-group label="Energy(Mcal)"></b-form-group>
                </b-col>
                <b-col md="4">
                  <vue-slider v-model="form.energy" />
                </b-col>
                <b-col md="2">
                  <b-form-input
                    v-model="form.energy"
                    type="number"
                    placeholder="Energy"
                    required
                    min="0"
                    disabled
                  ></b-form-input>
                </b-col>
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

    <!-- Modal Popup for Report -->
  </div>
</template>
<script>
import { ConfigSetting } from "../../../data/config";
import { toasterNotificationMixin } from "./../../../mixins/create-toast-mixin";
const token = localStorage.getItem("token");
import { mapState, mapActions } from "vuex";
import moment from "moment";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";

export default {
  components: {
    VueSlider,
  },
  mixins: [toasterNotificationMixin],
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: "Add/Edit Horse",
  },

  methods: {
    // onNew() {
    //   this.$router.push("/app/horsesfeeds/horsesfeedsdetail/0");
    // },
  },

  data() {
    return {
      addEditTitle: "Add Horse",
      errorTitle: "",
      errorMsg: [],
      classlist: [],
      breedlist: [],
      allFamilies: [],
      productByFamily: [],
      showoverlay: false,
      form: {
        horse_id: null,
        comments: null,
        weight: "0.00",
        dry_matter: "0.00",
        energy: "0.00",
        current_weight: "",
        breed_name: "",
        class_name: "",
        dob: "",
        last_report: "",
        status: true,
      },
      classs_id: "",
      breedd_id: "",
      products: [],
      groupBySelectedProduct: [],
      columnsHorseReport: [
        {
          label: "Description",
          field: "notes",
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
      horseReportList: [],
      horselist: [],
      imageFiles: null,
      docFiles: null,
      form2: {
        id: 0,
        notes: "",
        date: new Date().toISOString().slice(0, 19),
        horse_id: null,
        photos: [],
        files: [],
      },
    };
  },

  validations: {
    form: {
      // name: { required },
      // dob: { required },
      // current_weight: { required },
      // ideal_weight: { required },
    },

    form2: {
      // notes: { required },
      // date: { required },
    },
  },

  computed: {
    // groups() {
    //   return groupBy(this.selectedProduct, "product_family_id");
    // },
    family_idState() {
      if (this.form.family_id == "0") {
        return false;
      } else {
        return true;
      }
    },
    //Form 2
    notesState() {
      if (this.form2.notes == "" || this.form2.notes == null) {
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

    imageFilesState() {
      if (this.imageFiles == null || this.imageFiles.length == 0) {
        return false;
      } else {
        return true;
      }
    },

    docFilesState() {
      if (this.docFiles == null || this.docFiles.length == 0) {
        return false;
      } else {
        return true;
      }
    },
  },

  created() {
    this.getHorses();
    this.getAllBreeds();
    this.getAllClass();
    this.getAllFamilies();
    this.getProductByFamily();
    this.getsinglehorses();
    if (this.$route.params.id != null) {
      if (Number(this.$route.params.id) > 0) {
        this.showoverlay = true;
        this.addEditTitle = "Edit Horse feed";
        this.form.id = this.$route.params.id;
        this.getbyid();
      } else {
        // Reset our form values
        this.addEditTitle = "Add Horse Feed";
        this.form.id = 0;
        this.form.weight = "0.00";
        this.form.horse_id = null;
        this.form.comments = "";
        this.form.name = "";
        this.form.current_weight = "";
        this.form.last_report = "";
        this.form.class_name = "";
        this.form.breed_name = "";
        this.form.status = true;
      }
    }
  },

  methods: {
    resetform2() {
      this.form2.notes = "";
      this.form2.horse_id = null;
      this.form2.date = new Date().toISOString().slice(0, 10);
      this.form2.photos = [];
      this.form2.files = [];
    },

onCancel() {
      this.$router.push("/app/horsesfeeds/horsesfeedslist");
    },

    getbyid() {
      this.$axios
        .get(`${ConfigSetting.apiUrl}` + "horseDiets/" + Number(this.form.id), {
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

            //set feed list
            let tempPoducts = res.data.data["products"];
            if (tempPoducts !== undefined && tempPoducts.length > 0) {
              tempPoducts.forEach((element) => {
                let obj = {
                  product_id: element["id"],
                  product_name: element["name"],
                  product_family_id: element["family_id"],
                  product_family_name: element["family"]["name"],
                  value: element["pivot"]["value"],
                };
                this.products.push(obj);
              });
              this.groupBySelectedProduct = this.groupBy(
                this.products,
                "product_family_id"
              );
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
      let valid = true;
      let index = 0;
      this.errorMsg = [];
      if (this.products.length == 0) {
        this.errorMsg.push("Please add atleast one product.\n");
      }
     
      if (this.errorMsg.length > 0) {
        this.showErrorMsg(this.errorMsg);
        valid = false;
      }

      if (valid) {
        this.showoverlay = true;
        const token = localStorage.getItem("token");
        const params = new URLSearchParams();
        params.append("name", this.form.name);
        params.append("horse_id", this.form.horse_id);
        params.append("comments", this.form.comments);
        params.append("weight", this.form.weight);
        params.append("dry_matter", this.form.dry_matter);
        params.append("energy", this.form.energy);
        params.append(
          "status",
          this.form.status === true ? "active" : "inactive"
        );
        this.products.forEach((item, i) => {
          params.append(
            "products[" + i + "][product_id]",
            Number(item.product_id)
          );
          params.append("products[" + i + "][value]", Number(item.value));
          index++;
        });
        if (Number(this.form.id) > 0) {
          this.$axios
            .put(
              `${ConfigSetting.apiUrl}` + "horseDiets/" + Number(this.form.id),
              params,
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
            .post(`${ConfigSetting.apiUrl}` + "horseDiets", params, {
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
    getHorses() {
      this.$axios
        .get(`${ConfigSetting.apiUrl}` + "horses", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        .then((res) => {
          this.horselist = res.data.data;
          this.setHorseLableDetails();
        });
    },
    getAllBreeds() {
      this.$axios
        .get(`${ConfigSetting.apiUrl}` + "getAllBreed", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        .then((res) => {
          this.breedlist = res.data.data;
        });
    },
    getAllClass() {
      this.$axios
        .get(`${ConfigSetting.apiUrl}` + "getAllClass", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        .then((res) => {
          this.classlist = res.data.data;
        });
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
    getProductByFamily() {
      this.$axios
        .get(
          `${ConfigSetting.apiUrl}` +
            "getProductByFamily/" +
            Number(this.form.family_id),
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          this.productByFamily = res.data.data;
        });
    },
    removeproduct(item){
        this.products = this.products.filter((x) => x["product_id"] != item);
         this.groupBySelectedProduct = this.groupBy(
                this.products,
                "product_family_id"
          );
    },
    groupBy(array, key) {
      const result = {};
      array.forEach((item) => {
        if (!result[item[key]]) {
          result[item[key]] = [];
        }
        result[item[key]].push(item);
      });
      return result;
    },
    getFamilyName(familyId) {
      return this.allFamilies.find((x) => x["id"] == familyId)["name"];
    },
    getsinglehorses() {
      this.setHorseLableDetails();
    },
    setHorseLableDetails() {
      if (this.horselist) {
        var horsess = this.horselist.find((x) => x["id"] == this.form.horse_id);
        if (horsess !== undefined) {
          (this.form.dob =
            horsess["birth_date"].substr(
              0,
              horsess["birth_date"].indexOf(",")
            ) +
            " (" +
            moment(horsess["dob"], "yyyy-MM-dd").format("d/MM/yyyy") +
            ")"),
            (this.form.current_weight = horsess["current_weight"]),
            (this.form.last_report = "Last Report : " + horsess["last_report"]),
            (this.classs_id = horsess["class_id"]),
            (this.breedd_id = horsess["breed_id"]);
        }
        var nameclass = this.classlist.find((x) => x["id"] == this.classs_id);
        if (nameclass !== undefined) {
          this.form.class_name = nameclass["name"];
        }
        var namebreed = this.breedlist.find((x) => x["id"] == this.breedd_id);
        if (namebreed !== undefined) {
          this.form.breed_name = namebreed["name"];
        }
      }
    },
    getFamilyData() {
      this.setFeedList(this.form.product_id);
    },
    setFeedList(product_id) {
      let isAlreadyExsits = this.products.find(
        (x) => x["product_id"] === product_id
      );
      if (isAlreadyExsits !== undefined) {
        return false;
      }
      if (this.productByFamily) {
        var product = this.productByFamily.find(
          (x) => x["id"] === this.form.product_id
        );
        if (product !== null) {
          let obj = {
            product_id: product["id"],
            product_name: product["name"],
            product_family_id: product["family_id"],
            product_family_name: this.allFamilies.find(
              (x) => x["id"] === product["family_id"]
            )["name"],
            value: "0.00",
          };

          this.products.push(obj);
          this.groupBySelectedProduct = this.groupBy(
            this.products,
            "product_family_id"
          );
        }
      }
    },
  },
};
</script>
