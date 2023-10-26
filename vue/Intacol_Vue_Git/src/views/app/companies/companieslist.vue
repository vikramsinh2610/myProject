<template>
  <div class="main-content">
    <breadcumb :page="'List of Companies '" :folder="'Companies'" />
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
        :rows="companylist"
      >
        <div slot="table-actions" class="mb-3">
          <b-button variant="primary" class="btn-rounded" v-on:click="onNew">
            Add Company
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

const filename = "companies";
const token = localStorage.getItem("token");

export default {
  mixins: [toasterNotificationMixin],
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: "Companies",
  },
  data() {
    return {
      columns: [
        {
          label: "Company Name",
          field: "name",
          sortable: true,
        },
        {
          label: "Total Stables",
          field: "total_stable",
          sortable: true,
        },
        {
          label: "Total Horses",
          field: "total_horses",
          sortable: true,
        },
        {
          label: "Total Reports",
          field: "total_horse_reports",
          sortable: true,
        },
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
      companylist: [],
      showoverlay: false,
    };
  },
  methods: {
    onNew() {
      this.$router.push("/app/companies/companiesdetail/0");
    },
    onEdit(id) {
      this.$router.push("/app/companies/companiesdetail/" + id);
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
          this.companylist = res.data.data;
          this.companylist.forEach((data) => {
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
