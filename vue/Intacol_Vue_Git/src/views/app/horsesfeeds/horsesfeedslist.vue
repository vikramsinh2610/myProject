<template>
  <div class="main-content">
    <breadcumb :page="'List of Horse Feed'" :folder="'Horses'" />
    <!-- <div class="wrapper"> -->
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
      :rows="horsefeedlist"
    >
      <div slot="table-actions" class="mb-3">
        <b-button variant="primary" class="btn-rounded" v-on:click="onNew">
          Add Horses Feed
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
  </div>
</template>

<script>
import { ConfigSetting } from "../../../data/config";
import { toasterNotificationMixin } from "./../../../mixins/create-toast-mixin";
import moment from "moment";
const filename = "horseDiets";
const token = localStorage.getItem("token");

export default {
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: "Horse Feeds",
  },
  data() {
    return {
      horsefeedlist: [],
      showoverlay: false,
      columns: [
        {
          label: "Feed Name/Description",
          field: "comments",
          sortable: true,
        },
        // {
        //   label: "Horse Name",
        //   field: "horse.name",
        //   sortable: true,
        // },
        {
          label: "Date Started",
          field: this.fieldDateStarted,
          sortable: true,
        },
        {
          label: "Date Ended",
          field: this.fieldDateEnded,
          sortable: true,
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
    fieldDateStarted(rowObj) {
      let created_at = moment(
        rowObj.created_at,
        "YYYY-MM-DDTHH:mm:ss.SSSSZ"
      ).format("d/MM/yyyy HH:mm:ss");
      return created_at;
    },
    fieldDateEnded(rowObj) {
      let updated_at = moment(
        rowObj.updated_at,
        "YYYY-MM-DDTHH:mm:ss.SSSSZ"
      ).format("d/MM/yyyy HH:mm:ss");
      return updated_at;
    },
    onNew() {
      this.$router.push("/app/horsesfeeds/horsesfeedsdetail/0");
    },
    onEdit(id) {
      this.$router.push("/app/horsesfeeds/horsesfeedsdetail/" + id);
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
          this.horsefeedlist = res.data.data;
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
