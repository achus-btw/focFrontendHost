import data from './data.json' with { type: 'json' };

const NavbarTemplate = (name) => ``;
const petrolCosts = 106.45;
const SectionTemplate = (text) => `
  <section>
    <h2 class="placeholder">${text}</h2>
  </section>
`;

const emiPlans = [
  { months: 6, interest: 14 },
  { months: 12, interest: 16 },
  { months: 24, interest: 18 },
  { months: 0, interest: 0 }
];

// EMI Calculation
function calculateEMI(p, annualRate, months) {
  const r = annualRate / (12 * 100);
  var toPay = p * 0.7;
  const powerTerm = Math.pow(1 + r, months);
  const emi = (toPay * r * powerTerm) / (powerTerm - 1);
  return parseFloat(emi);
}

// Render extra sections (debug)
const render = () => {
  const main = document.getElementById('main-content');

  const newContent = `
    ${SectionTemplate("Thank you for using our services")}
  `;

  main.insertAdjacentHTML('beforeend', newContent);
};

// Check affordability
function isBikeQualified(bike, money, distance, ten, intr) {
  const emi = calculateEMI(
    bike.price,
    ten,
    intr
  );
  console.log("" + ten + '/' + intr + "/" + money)

  const travelCost = 30 * distance / parseFloat(bike.milage) * petrolCosts;

  return money > (emi + travelCost);
}

// Render bikes
const renderBikes = (filteredBikes, distance, ten, intr) => {
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
      ten,
      intr
    );

    const travelCost = 30 * distance / parseFloat(bike.milage) * 102;
    const totalMonthlyCost = (emi + travelCost).toFixed(2);

    bikeCard.innerHTML = `
      <div class="bikeItem">
        <h3>${bike.name}</h3>
        <p>Price: ₹${bike.price}</p>
        <p>Mileage: ${bike.milage} km/l</p>
        <p>EMI: ₹${emi} with a downpayment of ₹${(bike.price * 0.3).toFixed(0)}</p>
        <p>Fuel Cost: ₹${travelCost.toFixed(2)}</p>
        <p><strong>Total Monthly Cost: ₹${totalMonthlyCost}</strong></p>
      </div>
    `;

    bikeCard.addEventListener('click', () => {
      const query = encodeURIComponent(bike.name + " bike");
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    });

    bikesContainer.appendChild(bikeCard);
  });
};

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
const handlePostSubmit = () => {
  const commuteDistance = parseFloat(document.getElementById('commuteDistance').value);
  const monthlyBudget = parseFloat(document.getElementById('monthlyBudget').value);
  const emiIndex = parseInt(document.getElementById('emiPlan').value);
  var tenure = parseInt(document.getElementById('tenure').value);
  var intrest = parseInt(document.getElementById('interest').value);
  if (emiIndex != 3) {
    tenure = emiPlans[emiIndex].months
    intrest = emiPlans[emiIndex].interest

  }

  if (isNaN(commuteDistance) || isNaN(monthlyBudget) || isNaN(emiIndex)) {
    alert("Please fill all fields correctly");
    return;
  }

  const filteredBikes = data.filter(bike =>
    isBikeQualified(bike, monthlyBudget, commuteDistance, tenure, intrest)
  );

  renderBikes(filteredBikes, commuteDistance, tenure, intrest);

  console.log("Filtered Bikes:", filteredBikes);
};

// Add EMI dropdown options
const addEmiOptions = () => {
  const emiSelect = document.getElementById('emiPlan');

  emiPlans.forEach((plan, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${plan.months} months @ ${plan.interest}% interest`;
    if (plan.months == 0) {
      option.textContent = "custom"
    }

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
  const emiPlan = document.getElementById('emiPlan');
  const customEmiElement = document.getElementById('customEmi');

  emiPlan.addEventListener('change', function() {
    console.log(this.value)
    if (this.value == 3) {
      console.log("yes")
      //this partis called correctly
      customEmiElement.style.display = "block";

      setTimeout(() => {
        customEmiElement.style.opacity = "1";
      }, 10);
    } else {
      customEmiElement.style.opacity = "0";
      setTimeout(() => {
        customEmiElement.style.display = "none";
      }, 300);
    }
  });
  if (submitBtn) {
    submitBtn.addEventListener('click', handlePostSubmit);
  }
};
