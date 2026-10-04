import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/GiftFinder.css";
import { getProducts } from "../data/productService";
import usePetalia from "../context/usePetalia";

function GiftFinder() {
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = usePetalia();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Gift Finder could not load products:", error);
      }
    };

    loadProducts();
  }, []);

  /* =========================================================
     STATE
  ========================================================= */

  const [currentStep, setCurrentStep] = useState(1);

  const [answers, setAnswers] = useState({
    recipient: "",
    occasion: "",
    emotion: "",
    budget: "",
    style: "",
  });

  const [isFinding, setIsFinding] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [giftTypeFilter, setGiftTypeFilter] = useState("All Gifts");

  const [sortOption, setSortOption] = useState("Best Match");

  /* =========================================================
     GIFT FINDER OPTIONS
  ========================================================= */

  const recipients = [
    {
      name: "Partner",
      icon: "fi fi-rr-users",
    },
    {
      name: "Family",
      icon: "fi fi-rr-people-roof",
    },
    {
      name: "Friend",
      icon: "fi fi-rr-user",
    },
    {
      name: "Teacher",
      icon: "fi fi-rr-graduation-cap",
    },
    {
      name: "Colleague",
      icon: "fi fi-rr-briefcase",
    },
    {
      name: "Someone Special",
      icon: "fi fi-rr-gift",
    },
  ];

  const occasions = [
    {
      name: "Birthday",
      icon: "fi fi-rr-cake-birthday",
    },
    {
      name: "Anniversary",
      icon: "fi fi-rr-heart",
    },
    {
      name: "Graduation",
      icon: "fi fi-rr-graduation-cap",
    },
    {
      name: "Christmas",
      icon: "fi fi-rr-gift",
    },
    {
      name: "Thank You",
      icon: "fi fi-rr-hand-heart",
    },
    {
      name: "Just Because",
      icon: "fi fi-rr-star",
    },
  ];

  const emotions = [
    {
      name: "Love",
      icon: "fi fi-rr-heart",
    },
    {
      name: "Joy",
      icon: "fi fi-rr-sun",
    },
    {
      name: "Comfort",
      icon: "fi fi-rr-leaf",
    },
    {
      name: "Gratitude",
      icon: "fi fi-rr-flower",
    },
    {
      name: "Encouragement",
      icon: "fi fi-rr-star",
    },
  ];

  const budgets = [
    {
      name: "Under $15",
      icon: "fi fi-rr-wallet",
    },
    {
      name: "$15 – $24",
      icon: "fi fi-rr-wallet",
    },
    {
      name: "$25 – $40",
      icon: "fi fi-rr-wallet",
    },
    {
      name: "$40+",
      icon: "fi fi-rr-wallet",
    },
  ];

  const styles = [
    {
      name: "Simple & Elegant",
      icon: "fi fi-rr-leaf",
    },
    {
      name: "Warm & Thoughtful",
      icon: "fi fi-rr-heart",
    },
    {
      name: "Romantic & Sweet",
      icon: "fi fi-rr-flower",
    },
    {
      name: "Bright & Cheerful",
      icon: "fi fi-rr-sun",
    },
    {
      name: "Soft & Calm",
      icon: "fi fi-rr-leaf",
    },
    {
      name: "Surprise Me",
      icon: "fi fi-rr-gift",
    },
  ];

  /* =========================================================
     STEPS
  ========================================================= */

  const steps = [
    {
      number: 1,
      key: "recipient",
      label: "Recipient",
      question: "Who is the gift for?",
      helper: "Choose the person who will receive the gift.",
      note: "This helps us recommend gifts that match their relationship with you.",
      noteIcon: "fi fi-rr-heart",
      options: recipients,
    },

    {
      number: 2,
      key: "occasion",
      label: "Occasion",
      question: "What’s the occasion?",
      helper: "Choose the moment you’re gifting for.",
      note: "The occasion helps us choose gifts that feel right for the moment.",
      noteIcon: "fi fi-rr-gift",
      options: occasions,
    },

    {
      number: 3,
      key: "emotion",
      label: "Emotion",
      question: "What do you want your gift to say?",
      helper: "Choose the feeling you want to express.",
      note: "Your choice helps us understand the feeling behind your gift.",
      noteIcon: "fi fi-rr-heart",
      options: emotions,
    },

    {
      number: 4,
      key: "budget",
      label: "Budget",
      question: "What’s your budget?",
      helper: "Choose a range that feels comfortable for you.",
      note: "We’ll keep our recommendations within the range you choose.",
      noteIcon: "fi fi-rr-wallet",
      options: budgets,
    },

    {
      number: 5,
      key: "style",
      label: "Gift Style",
      question: "What kind of gift feels right?",
      helper: "Choose the style that best matches the person.",
      note: "Choose what feels right, or let Petalia surprise you.",
      noteIcon: "fi fi-rr-gift",
      options: styles,
    },
  ];

  const activeStep = steps[currentStep - 1];
  const selectedValue = answers[activeStep.key];

  /* =========================================================
     PETALIA PRODUCTS
     Uses the shared product data from src/data/products.js
  ========================================================= */

  const recommendedProducts = products;

  /* =========================================================
     PROGRESS
  ========================================================= */

  const progressWidth =
    currentStep === 1
      ? "0%"
      : `${((currentStep - 1) / (steps.length - 1)) * 100}%`;

  /* =========================================================
     SELECT OPTION
  ========================================================= */

  const selectOption = (value) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [activeStep.key]: value,
    }));
  };

  /* =========================================================
     NEXT
  ========================================================= */

  const handleNext = () => {
    if (!selectedValue) return;

    if (currentStep < 5) {
      setCurrentStep((previous) => previous + 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setIsFinding(true);

    setTimeout(() => {
      setIsFinding(false);
      setShowResults(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 1100);
  };

  /* =========================================================
     BACK
  ========================================================= */

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((previous) => previous - 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  /* =========================================================
     START AGAIN
  ========================================================= */

  const startAgain = () => {
    setCurrentStep(1);

    setAnswers({
      recipient: "",
      occasion: "",
      emotion: "",
      budget: "",
      style: "",
    });

    setGiftTypeFilter("All Gifts");
    setSortOption("Best Match");

    setShowResults(false);
    setIsFinding(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     BUDGET RANGE
  ========================================================= */

  const getBudgetRange = () => {
    switch (answers.budget) {
      case "Under $15":
        return {
          min: 0,
          max: 14.99,
        };

      case "$15 – $24":
        return {
          min: 15,
          max: 24.99,
        };

      case "$25 – $40":
        return {
          min: 25,
          max: 40,
        };

      case "$40+":
        return {
          min: 40,
          max: Infinity,
        };

      default:
        return {
          min: 0,
          max: Infinity,
        };
    }
  };

  /* =========================================================
   MATCH SCORE
  ========================================================= */

  /* Safely convert product data into an array.
    This works whether Supabase returns:
    "Friend"
    OR
    ["Friend", "Family"]
  */
  const toArray = (value) => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  };

  const calculateMatchScore = (product) => {
    let score = 0;

    /* RECIPIENT */
    if (
      toArray(product.recipients).some(
        (item) =>
          String(item).toLowerCase() === answers.recipient.toLowerCase(),
      )
    ) {
      score += 3;
    }

    /* OCCASION */
    if (
      toArray(product.occasion).some(
        (item) => String(item).toLowerCase() === answers.occasion.toLowerCase(),
      )
    ) {
      score += 3;
    }

    /* EMOTION */
    if (
      toArray(product.emotion).some(
        (item) => String(item).toLowerCase() === answers.emotion.toLowerCase(),
      )
    ) {
      score += 3;
    }

    /* GIFT STYLE */
    if (
      answers.style === "Surprise Me" ||
      toArray(product.giftStyles).some(
        (item) => String(item).toLowerCase() === answers.style.toLowerCase(),
      )
    ) {
      score += 3;
    }

    /* BUDGET */
    const budget = getBudgetRange();

    if (product.price >= budget.min && product.price <= budget.max) {
      score += 3;
    }

    return score;
  };

  /* =========================================================
     FILTER + SORT
  ========================================================= */

  let filteredMatches = recommendedProducts
    .map((product) => ({
      ...product,
      matchScore: calculateMatchScore(product),
    }))
    .filter((product) => {
      const budget = getBudgetRange();

      /* Product MUST be inside selected budget */
      const isWithinBudget =
        product.price >= budget.min && product.price <= budget.max;

      if (!isWithinBudget) {
        return false;
      }

      /* Don't show very weak recommendations */
      if (product.matchScore < 6) {
        return false;
      }

      /* Gift type filter */
      if (giftTypeFilter === "All Gifts") {
        return true;
      }

      return product.category === giftTypeFilter;
    });

  if (sortOption === "Best Match") {
    filteredMatches.sort((a, b) => b.matchScore - a.matchScore);
  }

  if (sortOption === "Price: Low to High") {
    filteredMatches.sort((a, b) => a.price - b.price);
  }

  if (sortOption === "Price: High to Low") {
    filteredMatches.sort((a, b) => b.price - a.price);
  }

  /* =========================================================
     BLOOM
  ========================================================= */

  const Bloom = () => (
    <span className="gf-page-bloom">
      <span className="gf-page-bloom-petal petal-a" />
      <span className="gf-page-bloom-petal petal-b" />
      <span className="gf-page-bloom-petal petal-c" />
      <span className="gf-page-bloom-petal petal-d" />
    </span>
  );

  /* =========================================================
     FINDING SCREEN
  ========================================================= */

  if (isFinding) {
    return (
      <main className="gf-page">
        <div className="gf-page-container">
          <section className="gf-finding-card">
            <div className="gf-finding-flower">
              <span />
              <span />
              <span />
              <span />

              <i className="fi fi-rr-heart" />
            </div>

            <span className="gf-finding-label">ONE MOMENT</span>

            <h1>
              Finding gifts that
              <span> match your story.</span>
            </h1>

            <p>
              We’re bringing together your choices to find thoughtful matches
              just for you.
            </p>

            <div className="gf-finding-dots">
              <span />
              <span />
              <span />
            </div>
          </section>
        </div>
      </main>
    );
  }

  /* =========================================================
     RESULTS PAGE
  ========================================================= */

  if (showResults) {
    return (
      <main className="gf-page">
        <div className="gf-page-container">
          {/* RESULTS INTRO */}

          <section className="gf-results-intro">
            <span className="gf-results-eyebrow">YOUR GIFT STORY</span>

            <h1>
              We found gifts that
              <span> match your story.</span>
            </h1>

            <p>
              Based on who you’re gifting, the moment, feeling, budget, and
              style you selected.
            </p>
          </section>

          {/* YOUR CHOICES */}

          <section className="gf-story-card">
            <div className="gf-story-heading">
              <div>
                <span>YOUR CHOICES</span>

                <h2>A little story behind your gift.</h2>
              </div>

              <i className="fi fi-rr-gift" />
            </div>

            <div className="gf-story-grid">
              <div className="gf-story-item">
                <span>Recipient</span>
                <strong>{answers.recipient}</strong>
              </div>

              <div className="gf-story-item">
                <span>Occasion</span>
                <strong>{answers.occasion}</strong>
              </div>

              <div className="gf-story-item">
                <span>Emotion</span>
                <strong>{answers.emotion}</strong>
              </div>

              <div className="gf-story-item">
                <span>Budget</span>
                <strong>{answers.budget}</strong>
              </div>

              <div className="gf-story-item">
                <span>Gift Style</span>
                <strong>{answers.style}</strong>
              </div>
            </div>
          </section>

          {/* THOUGHTFUL MATCHES */}

          <section className="gf-match-section">
            <div className="gf-match-top">
              <div>
                <span className="gf-results-eyebrow">THOUGHTFUL MATCHES</span>

                <h2>Gifts selected for you.</h2>
              </div>

              <span className="gf-result-count">
                {filteredMatches.length} gifts found
              </span>
            </div>

            {/* FILTER TOOLBAR */}

            <div className="gf-result-toolbar">
              <div className="gf-result-filter">
                <label>Refine your matches</label>

                <select
                  value={giftTypeFilter}
                  onChange={(e) => setGiftTypeFilter(e.target.value)}
                >
                  <option>All Gifts</option>

                  <option>Flowers</option>

                  <option>Candles</option>

                  <option>Gift Sets</option>
                </select>
              </div>

              <div className="gf-result-sort">
                <label>Sort by</label>

                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option>Best Match</option>

                  <option>Price: Low to High</option>

                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* PRODUCTS + MATCH REASON */}

            <div className="gf-results-layout">
              {/* PRODUCT GRID */}

              <div className="gf-product-results">
                {filteredMatches.map((product) => (
                  <article
                    key={product.id}
                    className="gf-result-product-card"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="gf-result-product-image">
                      <img src={product.image} alt={product.name} />

                      <button
                        type="button"
                        className={`gf-result-heart ${
                          isWishlisted(product.id) ? "saved" : ""
                        }`}
                        aria-label={
                          isWishlisted(product.id)
                            ? `Remove ${product.name} from wishlist`
                            : `Add ${product.name} to wishlist`
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                      >
                        <i
                          className={
                            isWishlisted(product.id)
                              ? "fi fi-sr-heart"
                              : "fi fi-rr-heart"
                          }
                        />
                      </button>
                    </div>

                    <div className="gf-result-product-info">
                      <span className="gf-result-product-type">
                        {product.category}
                      </span>

                      <h3>{product.name}</h3>

                      <div className="gf-result-product-bottom">
                        <strong>${product.price}</strong>

                        <span>{product.matchScore}/15 match</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* WHY THESE GIFTS */}

              <aside className="gf-match-reason-card">
                <div className="gf-match-reason-title">
                  <div>
                    <span>YOUR GIFT MATCH</span>

                    <h3>{answers.style}</h3>
                  </div>

                  <i className="fi fi-rr-heart" />
                </div>

                <p className="gf-match-description">
                  These gifts reflect the story you shared with Petalia.
                </p>

                <h4>Why these gifts?</h4>

                <div className="gf-match-reasons">
                  <div>
                    <i className="fi fi-rr-user" />

                    <span>
                      Chosen for your <strong>{answers.recipient}</strong>
                    </span>
                  </div>

                  <div>
                    <i className="fi fi-rr-gift" />

                    <span>
                      Fits a <strong>{answers.occasion}</strong> moment
                    </span>
                  </div>

                  <div>
                    <i className="fi fi-rr-heart" />

                    <span>
                      Expresses <strong>{answers.emotion}</strong>
                    </span>
                  </div>

                  <div>
                    <i className="fi fi-rr-wallet" />

                    <span>
                      Matches your <strong>{answers.budget}</strong> budget
                    </span>
                  </div>

                  <div>
                    <i className="fi fi-rr-leaf" />

                    <span>
                      Style: <strong>{answers.style}</strong>
                    </span>
                  </div>
                </div>

                <div className="gf-match-tip">
                  <i className="fi fi-rr-flower" />

                  <p>
                    Every gift is a little different. Choose the one that feels
                    most personal to you.
                  </p>
                </div>
              </aside>
            </div>
          </section>

          {/* RESULT BUTTONS */}

          <div className="gf-results-actions">
            <button
              type="button"
              className="gf-results-secondary"
              onClick={startAgain}
            >
              <i className="fi fi-rr-refresh" />
              Start Again
            </button>

            <button
              type="button"
              className="gf-results-primary"
              onClick={() => navigate("/shop")}
            >
              Browse All Gifts
              <i className="fi fi-rr-arrow-right" />
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     MAIN QUESTION PAGE
  ========================================================= */

  return (
    <main className="gf-page">
      <div className="gf-page-container">
        {/* INTRO */}

        <section className="gf-page-intro">
          <h1>
            Find something
            <br />
            that <span>feels just right.</span>
          </h1>

          <p>
            Answer a few simple questions and we'll help you discover a gift
            that feels thoughtful and personal.
          </p>
        </section>

        {/* PROGRESS */}

        <section className="gf-page-progress">
          <div className="gf-page-progress-line">
            <span
              className="gf-page-progress-fill"
              style={{
                width: progressWidth,
              }}
            />

            <span className="gf-page-progress-glow" />
          </div>

          <div className="gf-page-progress-steps">
            {steps.map((step) => {
              const isActive = currentStep === step.number;

              const isCompleted = currentStep > step.number;

              return (
                <div
                  key={step.number}
                  className={`gf-page-progress-step ${
                    isActive ? "active" : ""
                  } ${isCompleted ? "completed" : ""}`}
                >
                  <span className="gf-page-step-number">{step.number}</span>

                  <small>{step.label}</small>
                </div>
              );
            })}
          </div>
        </section>

        {/* QUESTION CARD */}

        <section key={currentStep} className="gf-page-card">
          <div className="gf-page-step-label">
            <span>{String(currentStep).padStart(2, "0")}</span>

            {activeStep.label}
          </div>

          <h2>{activeStep.question}</h2>

          <p className="gf-page-question-helper">{activeStep.helper}</p>

          {/* OPTIONS */}

          <div
            className={`gf-page-options ${
              activeStep.options.length === 4
                ? "four-options"
                : activeStep.options.length === 5
                  ? "five-options"
                  : ""
            }`}
          >
            {activeStep.options.map((option) => {
              const isSelected = selectedValue === option.name;

              return (
                <button
                  key={option.name}
                  type="button"
                  className={`gf-page-option ${isSelected ? "selected" : ""}`}
                  onClick={() => selectOption(option.name)}
                >
                  <span className="gf-page-option-icon-wrap">
                    <Bloom />

                    <span className="gf-page-option-icon">
                      <i className={option.icon} />
                    </span>
                  </span>

                  <span className="gf-page-option-name">{option.name}</span>
                </button>
              );
            })}
          </div>

          {/* NOTE */}

          <div className="gf-page-note">
            <i className={activeStep.noteIcon} />

            <span>{activeStep.note}</span>
          </div>

          {/* BUTTONS */}

          <div
            className={`gf-page-actions ${
              currentStep === 1 ? "single-action" : ""
            }`}
          >
            {currentStep > 1 && (
              <button
                type="button"
                className="gf-page-back"
                onClick={handleBack}
              >
                <i className="fi fi-rr-arrow-left" />
                Back
              </button>
            )}

            <button
              type="button"
              className="gf-page-continue"
              disabled={!selectedValue}
              onClick={handleNext}
            >
              {currentStep === 5 ? "Find My Gifts" : "Continue"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default GiftFinder;
