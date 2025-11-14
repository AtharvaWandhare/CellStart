/**
 * Amazon-Style Product Section JavaScript
 * Handles image gallery and subscription options
 * Variant selection is handled by the variant-radios custom element
 */

class AmazonProductSection {
  constructor(container) {
    this.container = container;
    this.sectionId = container.dataset.sectionId;
    
    this.thumbnails = container.querySelectorAll('.amazon-thumbnail');
    this.mainMediaItems = container.querySelectorAll('.amazon-main-media');
    this.subscriptionOptions = container.querySelectorAll(`input[name="purchase-option-${this.sectionId}"]`);
    
    this.init();
  }

  init() {
    this.setupImageGallery();
    this.setupSubscriptionOptions();
  }

  /**
   * Image Gallery: Thumbnail click to switch main image
   */
  setupImageGallery() {
    this.thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', (e) => {
        e.preventDefault();
        const mediaId = thumbnail.dataset.mediaId;
        this.switchMainMedia(mediaId);
      });
    });
  }

  switchMainMedia(mediaId) {
    // Update active thumbnail
    this.thumbnails.forEach(thumb => {
      if (thumb.dataset.mediaId === mediaId) {
        thumb.classList.add('active');
      } else {
        thumb.classList.remove('active');
      }
    });

    // Update active main media
    this.mainMediaItems.forEach(media => {
      if (media.dataset.mediaId === mediaId) {
        media.classList.add('active');
        // If it's a video, load it
        const video = media.querySelector('video');
        if (video && !video.src) {
          const source = video.querySelector('source');
          if (source && source.dataset.src) {
            source.src = source.dataset.src;
            video.load();
          }
        }
      } else {
        media.classList.remove('active');
      }
    });
  }

  /**
   * Subscription Options: Handle subscription/one-time toggle
   */
  setupSubscriptionOptions() {
    if (!this.subscriptionOptions.length) return;

    this.subscriptionOptions.forEach(option => {
      option.addEventListener('change', () => {
        this.handleSubscriptionChange(option);
      });
    });

    // Initialize with subscription selected by default
    const subscribedOption = Array.from(this.subscriptionOptions).find(opt => opt.checked);
    if (subscribedOption) {
      this.handleSubscriptionChange(subscribedOption);
    }
  }

  handleSubscriptionChange(selectedOption) {
    const isSubscription = selectedOption.value === 'subscription';
    
    // Update visual state of subscription boxes
    this.subscriptionOptions.forEach(option => {
      const parentBox = option.closest('.amazon-subscription-option');
      if (parentBox) {
        if (option.checked) {
          parentBox.classList.add('active');
        } else {
          parentBox.classList.remove('active');
        }
      }
    });

    // Show/hide delivery frequency dropdown
    const deliveryFrequency = this.container.querySelector('.amazon-delivery-frequency');
    const subscriptionBenefits = this.container.querySelector('.amazon-subscription-benefits');
    
    if (deliveryFrequency) {
      deliveryFrequency.style.display = isSubscription ? 'block' : 'none';
    }
    
    if (subscriptionBenefits) {
      subscriptionBenefits.style.display = isSubscription ? 'block' : 'none';
    }

    // Update selling plan select element value in the form
    const sellingPlanSelect = this.container.querySelector(`#selling-plan-${this.sectionId}`);
    if (sellingPlanSelect) {
      if (!isSubscription) {
        // Clear selection for one-time purchase
        sellingPlanSelect.selectedIndex = -1;
      } else {
        // Ensure first plan is selected for subscription
        if (sellingPlanSelect.selectedIndex === -1) {
          sellingPlanSelect.selectedIndex = 0;
        }
      }
    }
  }
}


/**
 * Custom element for variant radios
 */
if (!customElements.get('variant-radios')) {
  class VariantRadios extends HTMLElement {
    constructor() {
      super();
      this.addEventListener('change', this.onVariantChange);
    }

    onVariantChange() {
      this.updateOptions();
      this.updateMasterId();
      this.updatePickupAvailability();
      this.removeErrorMessage();
      
      if (!this.currentVariant) {
        this.toggleAddButton(true, '', false);
        this.setUnavailable();
      } else {
        this.updateMedia();
        this.updateURL();
        this.updateVariantInput();
        this.renderProductInfo();
        this.updateShareUrl();
      }
    }

    updateOptions() {
      this.options = Array.from(this.querySelectorAll('input[type="radio"]:checked'), (input) => input.value);
    }

    updateMasterId() {
      const variantsJson = this.querySelector('[type="application/json"]');
      if (!variantsJson) return;
      
      this.currentVariant = JSON.parse(variantsJson.textContent).find((variant) => {
        return !variant.options
          .map((option, index) => {
            return this.options[index] === option;
          })
          .includes(false);
      });
    }

    updateMedia() {
      if (!this.currentVariant) return;
      if (!this.currentVariant.featured_media) return;

      const mediaGallery = document.querySelector('.amazon-product-gallery');
      if (!mediaGallery) return;

      // Convert to string and handle both formats (with or without prefix)
      let newMediaId = this.currentVariant.featured_media.id;
      if (typeof newMediaId === 'number') {
        newMediaId = newMediaId.toString();
      }

      const thumbnails = mediaGallery.querySelectorAll('.amazon-thumbnail');
      const mainMedia = mediaGallery.querySelectorAll('.amazon-main-media');

      thumbnails.forEach((thumb) => {
        const thumbId = thumb.dataset.mediaId;
        // Compare as strings, and handle both exact match and ID-only match
        if (thumbId === newMediaId || thumbId.includes(newMediaId) || newMediaId.includes(thumbId)) {
          thumb.classList.add('active');
        } else {
          thumb.classList.remove('active');
        }
      });

      mainMedia.forEach((media) => {
        const mediaId = media.dataset.mediaId;
        // Compare as strings, and handle both exact match and ID-only match
        if (mediaId === newMediaId || mediaId.includes(newMediaId) || newMediaId.includes(mediaId)) {
          media.classList.add('active');
        } else {
          media.classList.remove('active');
        }
      });
    }

    updateURL() {
      if (!this.currentVariant || this.dataset.updateUrl === 'false') return;
      window.history.replaceState({}, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
    }

    updateShareUrl() {
      const shareButton = document.getElementById(`Share-${this.dataset.section}`);
      if (!shareButton || !shareButton.updateUrl) return;
      shareButton.updateUrl(`${window.shopUrl}${this.dataset.url}?variant=${this.currentVariant.id}`);
    }

    updateVariantInput() {
      const productForms = document.querySelectorAll(
        `#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`
      );
      productForms.forEach((productForm) => {
        const input = productForm.querySelector('input[name="id"]');
        input.value = this.currentVariant.id;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }

    updatePickupAvailability() {
      const pickUpAvailability = document.querySelector('pickup-availability');
      if (!pickUpAvailability) return;

      if (this.currentVariant && this.currentVariant.available) {
        pickUpAvailability.fetchAvailability(this.currentVariant.id);
      } else {
        pickUpAvailability.removeAttribute('available');
        pickUpAvailability.innerHTML = '';
      }
    }

    removeErrorMessage() {
      const section = this.closest('section');
      if (!section) return;

      const productForm = section.querySelector('product-form');
      if (productForm) productForm.handleErrorMessage();
    }

    renderProductInfo() {
      const requestedVariantId = this.currentVariant.id;
      const sectionId = this.dataset.section;

      fetch(
        `${this.dataset.url}?variant=${requestedVariantId}&section_id=${this.dataset.originalSection ? this.dataset.originalSection : sectionId}`
      )
        .then((response) => response.text())
        .then((responseText) => {
          if (this.currentVariant.id !== requestedVariantId) return;

          const html = new DOMParser().parseFromString(responseText, 'text/html');
          const destination = document.getElementById(`price-${sectionId}`);
          const source = html.getElementById(
            `price-${this.dataset.originalSection ? this.dataset.originalSection : sectionId}`
          );

          if (source && destination) destination.innerHTML = source.innerHTML;

          const price = document.getElementById(`price-${sectionId}`);

          if (price) price.classList.remove('visibility-hidden');

          if (this.currentVariant.sku) {
            const skuElement = document.querySelector(`[data-sku]`);
            if (skuElement) skuElement.textContent = this.currentVariant.sku;
          }

          this.toggleAddButton(
            !this.currentVariant.available,
            window.variantStrings.soldOut
          );

          this.updateSubscriptionPrices();
        });
    }

    updateSubscriptionPrices() {
      if (!this.currentVariant) return;

      const onetimePrice = document.querySelector('[data-onetime-price]');
      if (onetimePrice) {
        onetimePrice.textContent = this.formatMoney(this.currentVariant.price);
      }

      const subscriptionPrice = document.querySelector('[data-subscription-price]');
      if (subscriptionPrice) {
        const basePrice = this.currentVariant.price;
        const discountPercentage = 20; // Adjust based on your selling plan
        const discountedPrice = basePrice - (basePrice * discountPercentage / 100);
        subscriptionPrice.textContent = this.formatMoney(discountedPrice);
      }
    }

    toggleAddButton(disable = true, text, modifyClass = true) {
      const productForm = document.getElementById(`product-form-${this.dataset.section}`);
      if (!productForm) return;

      const addButton = productForm.querySelector('[name="add"]');
      const addButtonText = productForm.querySelector('[name="add"] > span');
      if (!addButton) return;

      if (disable) {
        addButton.setAttribute('disabled', 'disabled');
        if (text) addButtonText.textContent = text;
      } else {
        addButton.removeAttribute('disabled');
        addButtonText.textContent = window.variantStrings.addToCart || 'Add to cart';
      }
    }

    setUnavailable() {
      const button = document.getElementById(`product-form-${this.dataset.section}`);
      const addButton = button.querySelector('[name="add"]');
      const addButtonText = button.querySelector('[name="add"] > span');
      const price = document.getElementById(`price-${this.dataset.section}`);
      if (!addButton) return;
      addButtonText.textContent = window.variantStrings.unavailable || 'Unavailable';
      if (price) price.classList.add('visibility-hidden');
    }

    formatMoney(cents) {
      if (typeof Shopify !== 'undefined' && Shopify.formatMoney) {
        return Shopify.formatMoney(cents, theme.moneyFormat || '${{amount}}');
      }
      return `$${(cents / 100).toFixed(2)}`;
    }

    getVariantData() {
      this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
      return this.variantData;
    }
  }

  customElements.define('variant-radios', VariantRadios);
}

/**
 * Custom element for product form
 */
if (!customElements.get('product-form')) {
  class ProductForm extends HTMLElement {
    constructor() {
      super();

      this.form = this.querySelector('form');
      this.form.querySelector('[name=id]').disabled = false;
      this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
      this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
      this.submitButton = this.querySelector('[type="submit"]');

      if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');

      this.hideErrors = this.dataset.hideErrors === 'true';
    }

    onSubmitHandler(evt) {
      evt.preventDefault();
      if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

      this.handleErrorMessage();

      this.submitButton.setAttribute('aria-disabled', true);
      this.submitButton.classList.add('loading');
      this.querySelector('.loading-overlay__spinner').classList.remove('hidden');

      const config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete config.headers['Content-Type'];

      const formData = new FormData(this.form);
      if (this.cart) {
        formData.append(
          'sections',
          this.cart.getSectionsToRender().map((section) => section.id)
        );
        formData.append('sections_url', window.location.pathname);
        config.body = formData;
      }

      fetch(`${routes.cart_add_url}`, config)
        .then((response) => response.json())
        .then((response) => {
          if (response.status) {
            publish(PUB_SUB_EVENTS.cartError, {
              source: 'product-form',
              productVariantId: formData.get('id'),
              errors: response.errors || response.description,
              message: response.message,
            });
            this.handleErrorMessage(response.description);

            const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
            if (!soldOutMessage) return;
            this.submitButton.setAttribute('aria-disabled', true);
            this.submitButton.querySelector('span').classList.add('hidden');
            soldOutMessage.classList.remove('hidden');
            this.error = true;
            return;
          } else if (!this.cart) {
            window.location = window.routes.cart_url;
            return;
          }

          if (!this.error)
            publish(PUB_SUB_EVENTS.cartUpdate, {
              source: 'product-form',
              productVariantId: formData.get('id'),
              cartData: response,
            });
          this.error = false;
          const quickAddModal = this.closest('quick-add-modal');
          if (quickAddModal) {
            document.body.addEventListener(
              'modalClosed',
              () => {
                setTimeout(() => {
                  this.cart.renderContents(response);
                });
              },
              { once: true }
            );
            quickAddModal.hide(true);
          } else {
            this.cart.renderContents(response);
          }
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          this.submitButton.classList.remove('loading');
          if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
          if (!this.error) this.submitButton.removeAttribute('aria-disabled');
          this.querySelector('.loading-overlay__spinner').classList.add('hidden');
        });
    }

    handleErrorMessage(errorMessage = false) {
      if (this.hideErrors) return;

      this.errorMessageWrapper =
        this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
      if (!this.errorMessageWrapper) return;
      this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

      this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

      if (errorMessage) {
        this.errorMessage.textContent = errorMessage;
      }
    }
  }

  customElements.define('product-form', ProductForm);
}

function fetchConfig(type = 'json') {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: `application/${type}` },
  };
}

// Publish/Subscribe pattern helpers
const PUB_SUB_EVENTS = {
  cartUpdate: 'cart-update',
  cartError: 'cart-error',
};

let subscribers = {};

function subscribe(eventName, callback) {
  if (subscribers[eventName] === undefined) {
    subscribers[eventName] = [];
  }

  subscribers[eventName] = [...subscribers[eventName], callback];

  return function unsubscribe() {
    subscribers[eventName] = subscribers[eventName].filter((cb) => {
      return cb !== callback;
    });
  };
}

function publish(eventName, data) {
  if (subscribers[eventName]) {
    subscribers[eventName].forEach((callback) => {
      callback(data);
    });
  }
}

// Shopify routes (fallback)
window.routes = window.routes || {
  cart_add_url: '/cart/add',
  cart_url: '/cart',
  cart_update_url: '/cart/update',
  cart_change_url: '/cart/change',
};

/**
 * Initialize all Amazon product sections on page
 */
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.amazon-product-section');
  sections.forEach(section => {
    new AmazonProductSection(section);
  });
});

/**
 * Handle section reload in theme editor
 */
if (Shopify && Shopify.designMode) {
  document.addEventListener('shopify:section:load', (event) => {
    const section = event.target.querySelector('.amazon-product-section');
    if (section) {
      new AmazonProductSection(section);
    }
  });
}
