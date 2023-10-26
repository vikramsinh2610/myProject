export const toasterNotificationMixin = {
    created() {
        console.log("toasterNotificationMixin");
        this.showErrorMsg();
        this.showSuccessMsg();
    },

    methods: {
        showErrorMsg(message) {
            this.$bvToast.toast(message, {
                title: "Error Message",
                variant: "danger",
                solid: true,
                appendToast: true,
                autoHideDelay: 5000,
            });
        },

        showSuccessMsg(message) {
            this.$bvToast.toast(message, {
                title: "Success Message",
                variant: "success",
                solid: true,
                appendToast: true,
                autoHideDelay: 5000,
            });
        },

        handleCatchError(error) {

        }
    }
};
