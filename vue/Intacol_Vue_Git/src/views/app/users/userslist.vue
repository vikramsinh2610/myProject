<template>
  <div class="main-content">
    <breadcumb :page="'List of Users'" :folder="'Users'" />
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
        :rows="userslist"
      >
        <div slot="table-actions" class="mb-3">
          <b-button variant="primary" class="btn-rounded" v-on:click="onNew">
            Add User
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
const filename = "users";
const token = localStorage.getItem("token");

export default {
  mixins: [toasterNotificationMixin],
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: "Users",
  },
  data() {
    return {
      columns: [
        {
          label: "Username",
          field: "user_name",
          sortable: true,
        },
        {
          label: "Fullname",
          field: "full_name",
          sortable: true,
        },
        {
          label: "Email",
          field: "email",
          sortable: true,
        },
        {
          label: "Role",
          field: "roles.0.name",
          sortable: true,
        },
        {
          label: "Register At",
          field: "registered_at",
          sortable: true,
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
          label: "Activated At",
          field: "activated_at",
          sortable: true,
          type: "date",
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
      userslist: [],
      showoverlay: false,
    };
  },
  methods: {
    onNew() {
      this.$router.push("/app/users/usersdetail/0");
    },
    onEdit(id) {
      this.$router.push("/app/users/usersdetail/" + id);
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
          this.userslist = res.data.data;
          this.userslist.forEach((data) => {
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
    console.log(`Bearer ${token}`);
    this.showoverlay = true;
    this.loadItems();
  },
};
</script>
<style >
</style>
