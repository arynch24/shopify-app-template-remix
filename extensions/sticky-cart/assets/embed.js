let selectedRating = 0;

// Rating input functionality
document.addEventListener('DOMContentLoaded', function() {
    const ratingInput = document.getElementById('ratingInput');
    if (ratingInput) {
        ratingInput.addEventListener('click', function (e) {
            if (e.target.classList.contains('star')) {
                selectedRating = parseInt(e.target.dataset.rating);
                updateRatingDisplay();
            }
        });
    }
});

function updateRatingDisplay() {
    const stars = document.querySelectorAll('#ratingInput .star');
    stars.forEach((star, index) => {
        if (index < selectedRating) {
            star.classList.add('selected');
            star.classList.remove('empty');
        } else {
            star.classList.remove('selected');
            star.classList.add('empty');
        }
    });
}

function toggleReviewForm() {
    const form = document.getElementById('reviewForm');
    if (form) {
        form.classList.toggle('active');
    }
}

// Main widget initialization
document.addEventListener("DOMContentLoaded", async () => {
    const widget = document.getElementById("review-widget");
    if (!widget) return;

    const productId = widget.dataset.productId;
    const shop = widget.dataset.shop;

    await loadReviews(productId, shop);

    // Handle form submission
    const submitForm = document.getElementById('submitReviewForm');
    if (submitForm) {
        submitForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (selectedRating === 0) {
                alert('Please select a rating');
                return;
            }

            const submitButton = e.target.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;

            const formData = new FormData(e.target);

            const reviewData = {
                productId,
                shop,
                author: formData.get('author'),
                email: formData.get('email'),
                content: formData.get('content'),
                rating: selectedRating
            };

            try {
                const response = await fetch(`/apps/my-app/reviews`, {
                    method: "POST",
                    body: JSON.stringify(reviewData),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    alert("Review submitted successfully!");
                    // Reset form
                    e.target.reset();
                    selectedRating = 0;
                    updateRatingDisplay();
                    toggleReviewForm();
                    // Reload reviews
                    await loadReviews(productId, shop);
                } else {
                    const errorData = await response.json();
                    alert(errorData.error || "Error submitting review. Please try again.");
                }
            } catch (error) {
                console.error('Error submitting review:', error);
                alert("Error submitting review. Please try again.");
            } finally {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
});

async function loadReviews(productId, shop) {
    const loading = document.getElementById('loading');
    const header = document.getElementById('widgetHeader');
    const reviewsList = document.getElementById('reviewsList');

    try {
        // Show loading state
        if (loading) loading.style.display = 'block';
        if (header) header.style.display = 'none';

        // Fetch widget settings
        try {
            const settingsRes = await fetch(`/apps/my-app/settings?shop=${encodeURIComponent(shop)}`);
            if (settingsRes.ok) {
                const settings = await settingsRes.json();
                applySettings(settings);
            }
        } catch (settingsError) {
            console.warn('Could not load settings:', settingsError);
        }

        // Fetch reviews
        const reviewsRes = await fetch(`/apps/my-app/reviews?shop=${encodeURIComponent(shop)}&product=${encodeURIComponent(productId)}`);

        if (!reviewsRes.ok) {
            throw new Error(`HTTP error! status: ${reviewsRes.status}`);
        }

        const data = await reviewsRes.json();

        // Hide loading and show content
        if (loading) loading.style.display = 'none';
        if (header) header.style.display = 'block';

        if (data.summary) {
            updateRatingSummary(data.summary, data.reviews || []);
        } else {
            // Fallback: calculate summary from reviews
            const summary = calculateSummary(data.reviews || []);
            updateRatingSummary(summary, data.reviews || []);
        }

        displayReviews(data.reviews || []);

    } catch (error) {
        console.error('Error loading reviews:', error);
        if (loading) {
            loading.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #dc3545;">
                    <p>Error loading reviews. Please try again later.</p>
                    <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Retry</button>
                </div>
            `;
        }
    }
}

function applySettings(settings) {
    if (settings.primaryColor) {
        document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    }
    if (settings.fontSize) {
        document.body.style.fontSize = `${settings.fontSize}px`;
    }
}

function calculateSummary(reviews) {
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    const ratingBreakdown = [1, 2, 3, 4, 5].map(rating => ({
        rating,
        count: reviews.filter(r => r.rating === rating).length
    }));

    return {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingBreakdown
    };
}

function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;

    if (!reviews || reviews.length === 0) {
        reviewsList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #6c757d;">
                <p>No reviews yet. Be the first to write a review!</p>
            </div>
        `;
        return;
    }

    reviewsList.innerHTML = '';

    reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review-item';

        const starsHtml = generateStarsHtml(review.rating);
        const reviewDate = review.createdAt ? new Date(review.createdAt).toLocaleDateString() : '';

        reviewElement.innerHTML = `
            <div class="review-header">
                <div class="reviewer-info">
                    <span class="reviewer-name">${escapeHtml(review.author)}</span>
                    <div class="stars">${starsHtml}</div>
                </div>
                <span class="review-date">${reviewDate}</span>
            </div>
            <div class="review-content">${escapeHtml(review.content)}</div>
        `;

        reviewsList.appendChild(reviewElement);
    });
}

function updateRatingSummary(summary, reviews) {
    const { totalReviews, averageRating, ratingBreakdown } = summary;

    // Update overall rating display
    const overallRating = document.getElementById('overallRating');
    const reviewCount = document.getElementById('reviewCount');
    const overallStars = document.getElementById('overallStars');

    if (overallRating) overallRating.textContent = averageRating.toFixed(1);
    if (reviewCount) reviewCount.textContent = `${totalReviews} review${totalReviews !== 1 ? 's' : ''}`;

    // Update overall stars
    if (overallStars) {
        overallStars.innerHTML = generateStarsHtml(averageRating);
    }

    // Update rating breakdown - Fixed to properly show progress bars
    ratingBreakdown.forEach((ratingData) => {
        const rating = ratingData.rating;
        const count = ratingData.count;
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

        const fillElement = document.getElementById(`rating${rating}Fill`);
        const countElement = document.getElementById(`rating${rating}Count`);

        if (fillElement) {
            fillElement.style.setProperty('width', `${percentage}%`, 'important');
            fillElement.style.setProperty('background-color', '#ffc107', 'important');
            fillElement.style.setProperty('display', 'block', 'important');
            console.log(`Setting rating ${rating} fill to ${percentage}%`)
            console.log(`Setting rating ${rating} fill to ${percentage}%`); // Debug log
        }
        if (countElement) {
            countElement.textContent = `(${count})`;
        }
    });
}

function generateStarsHtml(rating) {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            starsHtml += '<span class="star">★</span>';
        } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
            starsHtml += '<span class="star">★</span>'; // You could implement half-stars here
        } else {
            starsHtml += '<span class="star empty">★</span>';
        }
    }
    return starsHtml;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}