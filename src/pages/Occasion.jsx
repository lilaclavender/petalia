import { useNavigate } from "react-router-dom";

import {
  CakeSlice,
  Heart,
  GraduationCap,
  Gift,
  PartyPopper,
  Baby,
  Flower2,
  Sparkles,
  Leaf,
  Star,
} from "lucide-react";

import "../styles/Occasion.css";

function Occasion() {
  const navigate = useNavigate();

  const occasions = [
    {
      id: "birthday",
      name: "Birthday",
      description: "Celebrate their special day with something thoughtful.",
      icon: CakeSlice,
      color: "pink",
    },
    {
      id: "anniversary",
      name: "Anniversary",
      description: "Celebrate love, memories, and meaningful milestones.",
      icon: Heart,
      color: "rose",
    },
    {
      id: "christmas",
      name: "Christmas",
      description: "Share warmth and joy during the festive season.",
      icon: Gift,
      color: "sage",
    },
    {
      id: "graduation",
      name: "Graduation",
      description: "Celebrate achievements and exciting new beginnings.",
      icon: GraduationCap,
      color: "lavender",
    },
    {
      id: "wedding",
      name: "Wedding",
      description: "Send beautiful wishes for a new chapter together.",
      icon: Flower2,
      color: "blush",
    },
    {
      id: "congratulations",
      name: "Congratulations",
      description: "Make their proud moment feel even more special.",
      icon: PartyPopper,
      color: "peach",
    },
    {
      id: "new-baby",
      name: "New Baby",
      description: "Welcome a little one with a sweet and thoughtful gift.",
      icon: Baby,
      color: "lilac",
    },
    {
      id: "just-because",
      name: "Just Because",
      description: "Sometimes the best gifts need no special reason.",
      icon: Sparkles,
      color: "mauve",
    },
  ];

  return (
    <main className="occasion-page">

      {/* ================= BREADCRUMB ================= */}
      <div className="occasion-breadcrumb-wrap">
        <div className="occasion-breadcrumb">
          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Home
          </button>

          <span>/</span>

          <strong>Shop by Occasion</strong>
        </div>
      </div>


      {/* ================= HERO ================= */}
      <section className="occasion-hero">

        {/* Large subtle flower */}
        <div
          className="occasion-flower-watermark"
          aria-hidden="true"
        >
          <span className="occasion-flower-petal petal-one" />
          <span className="occasion-flower-petal petal-two" />
          <span className="occasion-flower-petal petal-three" />
          <span className="occasion-flower-petal petal-four" />
          <span className="occasion-flower-petal petal-five" />
          <span className="occasion-flower-center" />
        </div>


        {/* Small decorative petals */}
        <span
          className="occasion-small-petal occasion-small-petal-left"
          aria-hidden="true"
        />

        <span
          className="occasion-small-petal occasion-small-petal-right"
          aria-hidden="true"
        />


        {/* Hero text */}
        <div className="occasion-hero-content">
          <p className="occasion-eyebrow">
            CHOOSE THE MOMENT
          </p>

          <h1>What are you celebrating?</h1>

          <p className="occasion-hero-description">
            Choose an occasion and discover gifts thoughtfully
            selected for the moment.
          </p>
        </div>

      </section>


      {/* ================= OCCASION SECTION ================= */}
      <section className="occasion-section">

        {/* ================= OCCASION CARDS ================= */}
        <div className="occasion-grid">

          {occasions.map((occasion) => {
            const Icon = occasion.icon;

            return (
              <button
                key={occasion.id}
                type="button"
                className="occasion-card"
                onClick={() =>
                  navigate(`/occasion/${occasion.id}`)
                }
              >

                {/* ICON AREA */}
                <div
                  className={`occasion-icon-area decoration-${occasion.id}`}
                >

                  <div
                    className={`occasion-icon occasion-icon-${occasion.color}`}
                  >

                    {/* Small bloom behind icon */}
                    <span
                      className="icon-bloom"
                      aria-hidden="true"
                    >
                      <span className="bloom-petal bloom-petal-1" />
                      <span className="bloom-petal bloom-petal-2" />
                      <span className="bloom-petal bloom-petal-3" />
                      <span className="bloom-petal bloom-petal-4" />
                    </span>

                    <Icon
                      className="occasion-main-icon"
                      size={22}
                      strokeWidth={1.6}
                    />

                  </div>


                  {/* BIRTHDAY */}
                  {occasion.id === "birthday" && (
                    <div className="occasion-mini-decor">
                      <Leaf className="mini-one" />
                      <Leaf className="mini-two" />
                    </div>
                  )}


                  {/* ANNIVERSARY */}
                  {occasion.id === "anniversary" && (
                    <div className="occasion-mini-decor">
                      <Heart className="mini-one" />
                      <Heart className="mini-two" />
                    </div>
                  )}


                  {/* CHRISTMAS */}
                  {occasion.id === "christmas" && (
                    <div className="occasion-mini-decor">
                      <Sparkles className="mini-one" />
                      <Star className="mini-two" />
                    </div>
                  )}


                  {/* GRADUATION */}
                  {occasion.id === "graduation" && (
                    <div className="occasion-mini-decor">
                      <Star className="mini-one" />
                      <Sparkles className="mini-two" />
                    </div>
                  )}


                  {/* WEDDING */}
                  {occasion.id === "wedding" && (
                    <div className="occasion-mini-decor">
                      <Leaf className="mini-one" />
                      <Leaf className="mini-two" />
                    </div>
                  )}


                  {/* CONGRATULATIONS */}
                  {occasion.id === "congratulations" && (
                    <div className="occasion-mini-decor">
                      <Sparkles className="mini-one" />
                      <Star className="mini-two" />
                    </div>
                  )}


                  {/* NEW BABY */}
                  {occasion.id === "new-baby" && (
                    <div className="occasion-mini-decor">
                      <Star className="mini-one" />
                      <Sparkles className="mini-two" />
                    </div>
                  )}


                  {/* JUST BECAUSE */}
                  {occasion.id === "just-because" && (
                    <div className="occasion-mini-decor">
                      <Leaf className="mini-one" />
                      <Leaf className="mini-two" />
                    </div>
                  )}

                </div>


                {/* CARD TEXT */}
                <h2>{occasion.name}</h2>

                <p className="occasion-card-description">
                  {occasion.description}
                </p>


                {/* EXPLORE */}
                <span className="occasion-explore">
                  Explore gifts
                  <span className="occasion-arrow">→</span>
                </span>

              </button>
            );
          })}

        </div>


        {/* ================= SHOP BY EMOTION BRIDGE ================= */}
        <div className="occasion-emotion-bridge">

          <div
            className="occasion-bridge-divider"
            aria-hidden="true"
          >
            <span />
            <Heart size={13} strokeWidth={1.5} />
            <span />
          </div>


          <p className="occasion-bridge-eyebrow">
            ANOTHER WAY TO FIND THE RIGHT GIFT
          </p>


          <h2>
            Still not sure of the occasion?
          </h2>


          <p className="occasion-bridge-description">
            Sometimes the feeling matters more than the moment.
          </p>


          <button
            type="button"
            className="occasion-bridge-link"
            onClick={() => navigate("/emotion")}
          >
            Shop by Emotion
            <span>→</span>
          </button>

        </div>

      </section>

    </main>
  );
}

export default Occasion;