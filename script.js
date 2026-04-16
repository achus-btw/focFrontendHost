import data from './data.json' with { type: 'json' };

const NavbarTemplate = (name) => ``;

const SectionTemplate = (text) => `
  <section>
    <h2 class="placeholder">${text}</h2>
  </section>
`;

const emiPlans = [
  { months: 6, interest: 5 },
  { months: 12, interest: 8 },
  { months: 24, interest: 10 }
];

// EMI Calculation
function calculateEMI(p, annualRate, months) {
  const r = annualRate / (12 * 100);
  const powerTerm = Math.pow(1 + r, months);
  const emi = (p * r * powerTerm) / (powerTerm - 1);
  return parseFloat(emi.toFixed(2));
}

// Render extra sections (debug)
const render = () => {
  const main = document.getElementById('main-content');

  const newContent = `
    ${SectionTemplate("System Ready")}
  `;

  main.insertAdjacentHTML('beforeend', newContent);
};

// Check affordability
function isBikeQualified(bike, money, distance, emiIndex) {
  const emi = calculateEMI(
    bike.price,
    emiPlans[emiIndex].interest,
    emiPlans[emiIndex].months
  );

  const travelCost = 30 * distance / parseFloat(bike.milage) * 102;

  return money > (emi + travelCost);
}

// Render bikes
const renderBikes = (filteredBikes, distance, emiIndex) => {
  const bikesContainer = document.querySelector('.bikes');
  bikesContainer.innerHTML = "";

  if (filteredBikes.length === 0) {
    bikesContainer.innerHTML = "<p>No bikes match your criteria</p>";
    return;
  }

  filteredBikes.forEach(bike => {
    const bikeCard = document.createElement('div');
    bikeCard.classList.add('bike-card');

    // Calculate costs
    const emi = calculateEMI(
      bike.price,
      emiPlans[emiIndex].interest,
      emiPlans[emiIndex].months
    );

    const travelCost = 30 * distance / parseFloat(bike.milage) * 102;
    const totalMonthlyCost = (emi + travelCost).toFixed(2);

    bikeCard.innerHTML = `
      <div class="bikeItem">
        <h3>${bike.name}</h3>
        <p>Price: ₹${bike.price}</p>
        <p>Mileage: ${bike.milage} km/l</p>
        <p>EMI: ₹${emi}</p>
        <p>Fuel Cost: ₹${travelCost.toFixed(2)}</p>
        <p><strong>Total Monthly Cost: ₹${totalMonthlyCost}</strong></p>
      </div>
    `;

    // Click → Google search
    bikeCard.addEventListener('click', () => {
      const query = encodeURIComponent(bike.name + " bike");
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    });

    bikesContainer.appendChild(bikeCard);
  });
};

// Scroll fade effect
const handleScroll = () => {
  const container = document.getElementById('main-content');
  const target = document.getElementById('fade-target');
  const hint = document.getElementById('hint');

  if (!target) return;

  const scrollY = container.scrollTop;
  const fadeLimit = window.innerHeight * 0.5;

  let opacity = 1 - (scrollY / fadeLimit);
  opacity = Math.max(0, Math.min(1, opacity));

  target.style.opacity = opacity;
  if (hint) hint.style.opacity = opacity;
};

// Handle submit
const handlePostSubmit = () => {
  const commuteDistance = parseFloat(document.getElementById('commuteDistance').value);
  const monthlyBudget = parseFloat(document.getElementById('monthlyBudget').value);
  const emiIndex = parseInt(document.getElementById('emiPlan').value);

  if (isNaN(commuteDistance) || isNaN(monthlyBudget) || isNaN(emiIndex)) {
    alert("Please fill all fields correctly");
    return;
  }

  const filteredBikes = data.filter(bike =>
    isBikeQualified(bike, monthlyBudget, commuteDistance, emiIndex)
  );

  renderBikes(filteredBikes, commuteDistance, emiIndex);

  console.log("Filtered Bikes:", filteredBikes);
};

// Add EMI dropdown options
const addEmiOptions = () => {
  const emiSelect = document.getElementById('emiPlan');

  emiPlans.forEach((plan, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${plan.months} months @ ${plan.interest}% interest`;

    emiSelect.appendChild(option);
  });
};

// Init
window.onload = () => {
  addEmiOptions();
  render();

  const main = document.getElementById('main-content');
  main.focus();
  main.addEventListener('scroll', handleScroll);

  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    submitBtn.addEventListener('click', handlePostSubmit);
  }
};
