document.addEventListener("DOMContentLoaded", async () => {
  const widget = document.getElementById("review-widget");
  if (!widget) return;

  const productId = widget.dataset.productId;
  const productHandle = widget.dataset.productHandle;
  const shop = widget.dataset.shop;

  // Fetch reviews
  const res = await fetch(`/apps/reviews?shop=${shop}&product=${productId}`);
  const { reviews } = await res.json();

  const container = document.createElement("div");
  container.style.fontSize = `${widget.style.getPropertyValue("--font-size")}px`;
  container.style.color = widget.style.getPropertyValue("--primary-color");

  // Display reviews
  reviews.forEach(r => {
    const review = document.createElement("p");
    review.textContent = `${r.author}: ${r.content}`;
    container.appendChild(review);
  });

  // Add form
  const form = document.createElement("form");
  form.innerHTML = `
    <input type="text" name="author" placeholder="Your name" required />
    <textarea name="content" placeholder="Write a review..." required></textarea>
    <button type="submit">Submit</button>
  `;
  form.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    await fetch("/apps/reviews", {
      method: "POST",
      body: JSON.stringify({
        productId,
        shop,
        author: formData.get("author"),
        content: formData.get("content")
      }),
      headers: { "Content-Type": "application/json" }
    });
    alert("Review submitted!");
    location.reload();
  };

  widget.appendChild(container);
  widget.appendChild(form);
});
