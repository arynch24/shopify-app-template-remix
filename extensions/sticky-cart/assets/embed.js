document.addEventListener("DOMContentLoaded", async () => {
  const widget = document.getElementById("review-widget");
  if (!widget) return;

  const productId = widget.dataset.productId;
  const shop = widget.dataset.shop;

  // ✅ Fetch widget settings from your public API
  const settingsRes = await fetch(`/apps/my-app/settings?shop=${shop}`);
  const { primaryColor, fontSize } = await settingsRes.json();

  // ✅ Apply dynamic styles
  const container = document.createElement("div");
  container.style.fontSize = `${fontSize}px`;
  container.style.color = primaryColor;

  // ✅ Fetch reviews
  const res = await fetch(`/apps/my-app/reviews?shop=${shop}&product=${productId}`);
  const { reviews } = await res.json();

  // ✅ Display reviews
  reviews.forEach(r => {
    const review = document.createElement("p");
    review.textContent = `${r.author}: ${r.content}`;
    review.style.margin = '5px 0';
    container.appendChild(review);
  });

  // ✅ Add review form
  const form = document.createElement("form");
  form.style.marginTop = "10px";
  form.innerHTML = `
    <input type="text" name="author" placeholder="Your name" required style="display:block; margin-bottom: 5px;" />
    <textarea name="content" placeholder="Write a review..." required style="display:block; margin-bottom: 5px;"></textarea>
    <button type="submit">Submit</button>
  `;

  form.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    await fetch(`/apps/my-app/reviews`, {
      method: "POST",
      body: JSON.stringify({
        productId,
        shop,
        author: formData.get("author"),
        content: formData.get("content")
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    alert("Review submitted!");
    location.reload();
  };

  widget.appendChild(container);
  widget.appendChild(form);
});
