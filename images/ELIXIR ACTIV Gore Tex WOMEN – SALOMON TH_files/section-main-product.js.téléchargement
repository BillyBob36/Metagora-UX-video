defineCustomElement(
  'main-product-detail',
  () =>
    class MainProduct extends HTMLElement {
      connectedCallback() {
        this.pageHeader = document.querySelector('header-layout');
        this.pageHeader.bindStickyCallback(this.onHeaderSticky.bind(this));
        this.stickyElements = this.querySelectorAll('.product__column-sticky');
      }

      onHeaderSticky(data) {
        const { sticking, height, top } = data;

        this.stickyElements.forEach((element) => {
          if (sticking) {
            const myTop = top + height;
            element.style.top = `${myTop}px`;
          } else {
            element.style = null;
          }
        });
      }
    },
);
