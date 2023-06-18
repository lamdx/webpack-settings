<template>
  <div class="modal-mask">
    <div class="modal-container">
      <div
        v-infinite-scroll="loading"
        class="dialog-body border-b-s"
        infinite-scroll-disabled="disaleScrolling"
        infinite-scroll-distance="40"
      >
        <canvas
          v-for="index in pages"
          :id="'pre-canvas-' + index"
          :key="index"
        ></canvas>
      </div>
    </div>
  </div>
</template>
<script>
// import PDF from 'pdfjs-dist';
export default {
  name: 'Pdf',
  data() {
    return {
      src: '',
      pdfDoc: null,
      total: 0,
      pages: 0,
      page: 1,
      pageSize: 10,
      pageIndex: 1,
      disableScrolling: true
    };
  },
  created() {},
  methods: {
    show(src) {
      this.src = src;
      this.loadPdfFile();
    },
    loadPdfFile() {
      console.log('loading 加载中...');
      // PDF.getDocument(this.src)
      //   .then(pdf => {
      //     console.log('loading 关闭');
      //     this.pdfDoc = pdf;
      //     this.total = pdf.numPages;
      //     this.$nextTick(() => {
      //       this.loadingMore();
      //     });
      //   })
      //   .catch(err => {
      //     console.log(err || '文件加载失败');
      //   });
    },
    loading() {
      if (this.page >= this.total) {
        this.disableScrolling = true;
        return;
      }
      this.pageIndex += 1;
      this.page += 1;
      this.$nextTick(() => {
        this.loadingMore();
      });
    },
    loadingMore() {
      if (this.total <= this.pageIndex * this.pageSize) {
        this.pages = this.total;
      } else {
        this.pages = this.pageIndex * this.pageSize;
      }
      this.renderPageOne();
    },
    renderPageOne() {
      this.disableScrolling = true;
      this.pdfDoc.getPage(this.page).then(async pdfPage => {
        const canvas = document.getElementById(`pre-canvas-${this.page}`);
        const ctx = canvas.getContext('2d');
        const scale = 1.5;
        const viewport = pdfPage.getViewport(scale);
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const params = {
          canvasContext: ctx,
          viewport
        };
        const renderTask = pdfPage.render(params);
        renderTask.promise.then(() => {
          this.disableScrolling = false;
          if (this.page < this.pages) {
            this.page++;
            this.renderPageOne(this.page);
          }
        });
      });
    }
  }
};
</script>
<style lang="less" scoped>
.dialog-body > canvas {
  width: 100%;
}
.dialog-body {
  width: 375px;
  height: 100vh;
  position: relative;
  overflow-y: scroll;
}
.dialog-body > img {
  width: 100%;
}
.border-b-s {
  position: relative;
}
.border-b-s::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  color: #d9d9d9;
  bottom: 0;
  border-bottom: 1px solid #d9d9d9;
  transform-origin: 0 100%;
  transform: scaleY(0.5);
}
.modal-mask {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
  margin-top: 44px;
}
.modal-container {
  background-color: #fff;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}
.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 15px;
  margin-top: 17px;
  font-size: 15px;
  color: #333;
}
.confirm {
  width: 100%;
  font-size: 17px;
  color: #3386ed;
  height: 45px;
  line-height: 45px;
  text-align: center;
}
</style>
