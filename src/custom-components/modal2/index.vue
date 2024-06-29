<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <slot name="header">
          {{ internalOptions.header || 'Default Header' }}
        </slot>
      </div>
      <div class="modal-body">
        <slot>{{ internalOptions.body || 'Default Body' }}</slot>
      </div>
      <div class="modal-footer">
        <slot name="footer">
          <button @click="handleConfirm">
            {{ internalOptions.confirmText || 'Confirm' }}
          </button>
          <button @click="handleCancel">
            {{ internalOptions.cancelText || 'Cancel' }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      visible: this.value,
      internalOptions: this.options
    };
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit('input', val);
    }
  },
  methods: {
    open(options = {}) {
      this.internalOptions = { ...this.internalOptions, ...options };
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
    handleConfirm() {
      if (this.internalOptions.onConfirm) {
        this.internalOptions.onConfirm();
      }
      this.close();
    },
    handleCancel() {
      if (this.internalOptions.onCancel) {
        this.internalOptions.onCancel();
      }
      this.close();
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
}
</style>
