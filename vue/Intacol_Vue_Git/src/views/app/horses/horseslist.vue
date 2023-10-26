<template>
  <div class="main-content">
    <breadcumb :page="'List of Horses'" :folder="'Horses'" />
    <!-- <div class="wrapper"> -->
    <b-overlay :show="showoverlay" rounded="sm">
      <vue-good-table
        :columns="columns"
        :search-options="{
          enabled: true,
          placeholder: 'Search this table',
        }"
        :pagination-options="{
          enabled: true,
          mode: 'records',
        }"
        styleClass="tableOne vgt-table"
        :rows="horselist"
      >
        <div slot="table-actions" class="mb-3">
          <b-button variant="primary" class="btn-rounded" v-on:click="onNew">
            Add Horse
          </b-button>
        </div>

        <template slot="table-row" slot-scope="props">
          <span v-if="props.column.field == 'button'">
            <a v-on:click="onEdit(props.row.id)">
              <i class="i-Eraser-2 text-25 text-success mr-2"></i>
              <!-- {{ props.row.button }} -->
            </a>
            <a v-on:click="onDelete(props.row.id)">
              <i class="i-Close-Window text-25 text-danger"></i>
              <!-- {{ props.row.button }} -->
            </a>
          </span>
        </template>
      </vue-good-table>
    </b-overlay>
  </div>
</template>

<script>
import { ConfigSetting } from "../../../data/config";
import { toasterNotificationMixin } from "./../../../mixins/create-toast-mixin";
import moment from "moment";
const filename = "horses";
const token = localStorage.getItem("token");

export default {
  mixins: [toasterNotificationMixin],
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: "Horses",
  },
  data() {
    return {
      horselist: [],
      showoverlay: false,
      columns: [
        {
          label: "Horse Name",
          field: "name",
          sortable: true,
        },
        {
          label: "Class Name",
          field: "class.name",
          sortable: true,
        },
        {
          label: "Breed Name",
          field: "breed.name",
          sortable: true,
        },
        {
          label: "Total Years/DOB",
          field: this.fieldDob,
        },
        {
          label: "Current Weight",
          field: "current_weight",
          sortable: true,
        },
        // {
        //   label: "Last Report",
        //   field: "updated_at",
        //   sortable: true,
        //   type: "date",
        //   dateInputFormat: "yyyy-MM-dd\'T\'HH:mm:ssXXX",
        //   dateOutputFormat: "d/MM/yyyy",
        // },
        {
          label: "Status",
          field: "status",
          sortable: true,
          html: true,
          tdClass: "text-center",
          thClass: "text-center",
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
    };
  },
  methods: {
    fieldDob(rowObj) {
      let dob =
        rowObj.birth_date +
        " (" +
        moment(rowObj.dob, "yyyy-MM-dd").format("d/MM/yyyy") +
        ")";
      return dob;
    },
    onNew() {
      this.$router.push("/app/horses/horsesdetail/0");
    },
    onEdit(id) {
      this.$router.push("/app/horses/horsesdetail/" + id);
    },
    onDelete(id) {
      this.$bvModal
        .msgBoxConfirm("Are you sure, do you want to delete this record?")
        .then((value) => {
          if (value) {
            this.showoverlay = true;
            this.userslist = [];

            this.$axios
              .delete(`${ConfigSetting.apiUrl}` + filename + "/" + id, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
              })
              .then((res) => {
                this.loadItems();
              });
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },

    // load items is what brings back the rows from server
    loadItems() {
      this.$axios
        .get(`${ConfigSetting.apiUrl}` + filename, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        .then((res) => {
          this.showoverlay = false;
          this.horselist = res.data.data;
          this.horselist.forEach((data) => {
            if (data.status === "active") {
              data.status = '<span class="badge badge-success">Active</span>';
            } else {
              data.status = '<span class="badge badge-danger">Inactive</span>';
            }
          });
        });
    },
  },

  mounted: function () {
    this.showoverlay = true;
    this.loadItems();
  },
};
</script>
<style >
</style>
