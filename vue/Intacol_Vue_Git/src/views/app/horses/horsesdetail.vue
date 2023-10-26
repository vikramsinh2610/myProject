<template>
  <div class="main-content">
    <breadcumb :page="'Horses Add/Edit'" :folder="'Horses'" />
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
                  label="Horse Name"
                  label-for="input-1"
                >
                  <b-form-input
                    v-model="form.name"
                    type="text"
                    required
                    :state="nameState"
                    placeholder="Horse Name"
                  ></b-form-input>
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
                  label="Select Stable Name"
                  label-for="input-1"
                >
                  <b-form-select
                    v-model="form.stable_id"
                    :options="stablelist"
                    value-field="id"
                    text-field="name"
                    :state="stable_idState"
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
                  label="Select Class Name"
                  label-for="input-1"
                >
                  <b-form-select
                    v-model="form.class_id"
                    :options="classlist"
                    value-field="id"
                    text-field="name"
                    :state="class_idState"
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
                  label="Select Breed Name"
                  label-for="input-1"
                >
                  <b-form-select
                    v-model="form.breed_id"
                    :options="breedlist"
                    value-field="id"
                    text-field="name"
                    :state="breed_idState"
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
                  label="Birthdate"
                  label-for="input-1"
                >
                  <b-form-datepicker
                    id="form.dob"
                    v-model="form.dob"
                    class="mb-2"
                    :state="dobState"
                  ></b-form-datepicker>
                </b-form-group>

                <b-form-group
                  class="col-md-6 mb-3"
                  label="Current Weight"
                  label-for="input-1"
                >
                  <b-form-input
                    v-model="form.current_weight"
                    type="text"
                    required
                    :state="current_weightState"
                    placeholder="Current Weight"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  class="col-md-6 mb-3"
                  label="Ideal Weight"
                  label-for="input-1"
                >
                  <b-form-input
                    v-model="form.ideal_weight"
                    type="text"
                    required
                    :state="ideal_weightState"
                    placeholder="Ideal Weight"
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

                <!-- <b-form-group
                  label="Current Feed/Diet"
                  label-for="input-1"
                  class="col-md-6"
                >
                  <vue-good-table
                    :columns="columns"
                    :line-numbers="true"
                    styleClass="tableOne vgt-table"
                    :rows="rows"
                  >
                    <div slot="table-actions" class="mb-3">
                      <b-button
                        variant="primary"
                        class="btn-rounded"
                        v-on:click="onNew"
                      >
                        Add New Feed
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
                </b-form-group> -->

                <b-col md="12" v-if="form.id > 0">
                  <vue-good-table
                    :columns="columnsHorseReport"
                    styleClass="tableOne vgt-table"
                    :rows="horseReportList"
                  >
                    <div slot="table-actions" class="mb-3">
                      <b-button
                        id="btnShow"
                        variant="primary"
                        class="btn-rounded"
                        @click="addNew"
                      >
                        Add New Report
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

    <!-- Modal Popup for Report -->
    <b-modal id="modal-1" ref="modal-1" hide-footer title="Report">
      <b-form
        ref="form2"
        id="form2"
        name="form2"
        @submit.prevent="handleReport"
      >
        <b-form-group label="Observation here" label-for="Title-input">
          <b-form-input
            id="Title-input"
            v-model="form2.notes"
            required
            :state="notesState"
            placeholder="Observation here"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Attach multiple photos" label-for="Title-input">
          <b-form-file
            v-model="imageFiles"
            class="mt-3"
            multiple
            accept=".jpg, .png, .jpeg, .tiff "
          ></b-form-file>
          <!-- :state="imageFilesState" -->
          <!-- <b-form-invalid-feedback id="input-live-feedback">
            Attach atleast 1 image file
          </b-form-invalid-feedback> -->
        </b-form-group>

        <b-form-group
          label=" Existing Image(s)"
          v-if="form2.id > 0 && form2.photos.length > 0"
          label-for="Title-input"
          style="text-align: right"
        >
          <div v-for="img in form2.photos" :key="img.id">
            <!-- <a href="img.full_url" target="_blank">Preview {{ img.name }}</a> -->
            {{ img.name }}
          </div>
        </b-form-group>

        <b-form-group label="Attach multiple docs" label-for="Title-input">
          <b-form-file
            v-model="docFiles"
            class="mt-3"
            multiple
            accept=".xls, .pdf, .docx, .txt "
          ></b-form-file>
          <!-- :state="docFilesState" -->
          <!-- <b-form-invalid-feedback id="input-live-feedback">
            Attach atleast 1 doc file
          </b-form-invalid-feedback> -->
        </b-form-group>

        <b-form-group
          label="Existing File(s)"
          v-if="form2.id > 0 && form2.files.length > 0"
          label-for="Title-input"
          style="text-align: right"
        >
          <div v-for="img in form2.files" :key="img.id">
            {{ img.name }}
          </div>
        </b-form-group>

        <b-form-group
          label="Date when report was created"
          label-for="date-input"
        >
          <!-- <b-form-datepicker
            id="form2.date"
            v-model="form2.date"
            class="mb-2"
            :state="dateState"
            locale="en"
          ></b-form-datepicker> -->

          <input
            type="datetime-local"
            id="form2.date"
            v-model="form2.date"
            class="form-control"
            :state="dateState"
            required
          />
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
          @click="hideModal"
          id="cancel"
        >
          Cancel
        </b-button>
      </b-form>
    </b-modal>
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
      companylist: [],

      classlist: [],

      stablelist: [],

      breedlist: [],

      showoverlay: false,

      form: {
        name: "",
        dob: new Date().toISOString().slice(0, 10),
        current_weight: "",
        ideal_weight: "",
        company_id: 0,
        stable_id: 0,
        class_id: 0,
        breed_id: 0,
        status: true,
      },

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
        horse_id: "0",
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
    nameState() {
      if (this.form.name == "" || this.form.name == null) {
        return false;
      } else {
        return true;
      }
    },

    dobState() {
      if (this.form.dob == "" || this.form.dob == null) {
        return false;
      } else {
        return true;
      }
    },

    current_weightState() {
      if (this.form.current_weight == "" || this.form.current_weight == null) {
        return false;
      } else {
        return true;
      }
    },

    ideal_weightState() {
      if (this.form.ideal_weight == "" || this.form.ideal_weight == null) {
        return false;
      } else return true;
    },

    company_idState() {
      if (this.form.company_id == "0") {
        return false;
      } else return true;
    },

    stable_idState() {
      if (this.form.stable_id == "0") {
        return false;
      } else {
        return true;
      }
    },

    class_idState() {
      if (this.form.class_id == "0") {
        return false;
      } else {
        return true;
      }
    },

    breed_idState() {
      if (this.form.breed_id == "" || this.form.breed_id == null) {
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
    this.getCompanies();
    this.getAllBreeds();
    this.getAllClass();
    this.getAllStables();
    if (this.$route.params.id != null) {
      if (Number(this.$route.params.id) > 0) {
        this.showoverlay = true;
        this.addEditTitle = "Edit Horse";
        this.form.id = this.$route.params.id;
        this.getbyid();
        this.getHorseReport();
      } else {
        // Reset our form values
        this.addEditTitle = "Add Horse";
        this.form.id = 0;
        this.form.dob = new Date().toISOString().slice(0, 10);
        this.form.current_weight = "";
        this.form.ideal_weight = "";
        this.form.company_id = 0;
        this.form.stable_id = 0;
        this.form.class_id = 0;
        this.form.breed_id = 0;
        this.form.status = true;
      }
    }
  },

  methods: {
    resetform2() {
      this.form2.notes = "";
      this.form2.horse_id = "0";
      this.form2.date = new Date().toISOString().slice(0, 10);
      this.form2.photos = [];
      this.form2.files = [];
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

    handleReport() {
      let valid = true;
      this.errorMsg = [];

      if (this.form2.date == "") {
        this.errorMsg.push("The date is required.\n");
      }

      if (this.errorMsg.length > 0) {
        this.showErrorMsg(this.errorMsg);
        valid = false;
      }

      if (valid) {
        this.showoverlay = true;
        const token = localStorage.getItem("token");
        console.log(this.form2.date);

        const formData = new FormData();
        formData.append("notes", this.form2.notes);
        formData.append("horse_id", this.form.id);
        formData.append(
          "date",
          moment(this.form2.date).format("YYYY-MM-DD hh:mm:ss")
        );
        if (this.imageFiles != null && this.imageFiles.length > 0) {
          for (let i = 0; i < this.imageFiles.length; i++) {
            formData.append("photos[]", this.imageFiles[i]);
          }
        }

        if (this.docFiles != null && this.docFiles.length > 0) {
          for (let i = 0; i < this.docFiles.length; i++) {
            formData.append("files[]", this.docFiles[i]);
          }
        }

        this.hideModal();
        if (Number(this.form2.id) > 0) {
          formData.append("_method", "PUT");

          this.$axios
            .post(
              `${ConfigSetting.apiUrl}` + "horseReports/" + this.form2.id,
              formData,
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
                this.showoverlay = false;
              }, 1000);
            });
        } else {
          this.$axios
            .post(`${ConfigSetting.apiUrl}` + "horseReports", formData, {
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
                this.showoverlay = false;
              }, 1000);
            });
        }
      }
    },

    onEdit(id) {
      this.showoverlay = true;
      this.$axios
        .get(`${ConfigSetting.apiUrl}` + "horseReports/" + Number(id), {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            this.form2 = res.data.data;
            this.form2.id = id;
            this.form2.photos = res.data.data.photos;
            this.form2.files = res.data.data.files;
            this.form2.date = moment(res.data.data.date).format(
              "YYYY-MM-DDThh:mm"
            );
            console.log(this.form2.date);
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
            this.horseReportList = [];

            this.$axios
              .delete(`${ConfigSetting.apiUrl}` + "horseReports" + "/" + id, {
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

    onCancel() {
      this.$router.push("/app/horses/horseslist");
    },

    getbyid() {
      this.$axios
        .get(`${ConfigSetting.apiUrl}` + "horses/" + Number(this.form.id), {
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

          this.getHorseReport();
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
        this.errorMsg.push("The company is required.\n");
      }
      if (this.form.stable_id == "0") {
        this.errorMsg.push("The stable is required.\n");
      }
      if (this.form.class_id == "0") {
        this.errorMsg.push("The class is required.\n");
      }
      if (this.form.breed_id == "0") {
        this.errorMsg.push("The breed is required.\n");
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
          dob: this.form.dob,
          current_weight: this.form.current_weight,
          ideal_weight: this.form.ideal_weight,
          company_id: this.form.company_id,
          stable_id: this.form.stable_id,
          class_id: this.form.class_id,
          breed_id: this.form.breed_id,
          status: this.form.status === true ? "active" : "inactive",
        };

        if (Number(this.form.id) > 0) {
          this.$axios
            .put(
              `${ConfigSetting.apiUrl}` + "horses/" + Number(this.form.id),
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
            .post(`${ConfigSetting.apiUrl}` + "horses", body, {
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
        });
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

    getAllStables() {
      this.$axios
        .get(`${ConfigSetting.apiUrl}` + "stables", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        .then((res) => {
          this.stablelist = res.data.data;
        });
    },

    getHorseReport() {
      this.$axios
        .get(`${ConfigSetting.apiUrl}` + "horseReports", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        .then((res) => {
          this.horseReportList = res.data.data;
        });
    },
  },
};
</script>
