# Design Write-Up: Court Booking System

## Database Design Approach

### Core Philosophy
The database design follows a **document-oriented approach** using MongoDB, optimized for the specific query patterns of a booking system. The key design principle was to balance between normalization (avoiding data duplication) and denormalization (optimizing read performance).

### Schema Design Decisions

**1. Booking Schema - The Central Entity**
The Booking collection is the heart of the system. I chose to:
- **Reference** Court, User, Coach, and Equipment using ObjectId references for data integrity
- **Embed** the pricing breakdown directly in each booking document

This hybrid approach means we can always trace back to the original resources while preserving the exact pricing at the time of booking. If an admin changes a court's price later, existing bookings retain their original pricing - crucial for financial accuracy.

**2. Multi-Resource Availability**
The availability checking mechanism uses a time-overlap algorithm:
```
Overlap exists if: newStart < existingEnd AND existingStart < newEnd
```

This is implemented across three dimensions:
- **Court availability**: Query existing bookings for the same court and overlapping time
- **Coach availability**: Query bookings with the same coach and overlapping time  
- **Equipment availability**: Sum quantities of equipment in overlapping bookings, compare with total inventory

All three checks run in parallel using `Promise.all()` for optimal performance.

**3. Pricing Rules Schema**
Rather than hardcoding pricing logic, I created a flexible `PricingRule` schema that allows admins to define rules declaratively:
- **Type-based categorization**: peak_hour, weekend, holiday, indoor_premium, early_bird, custom
- **Flexible modifiers**: multiplier (1.5x), fixed_addition (+$10), percentage (+20%)
- **Priority ordering**: Higher priority rules apply first, preventing conflicts
- **Scope control**: Rules can apply to all courts, only indoor, or only outdoor

This design means new pricing strategies can be added through the admin UI without code changes.

---

## Pricing Engine Approach

### Architecture
The pricing engine (`utils/pricingEngine.js`) follows a **pipeline pattern**:

```
Input → Base Calculation → Rule Application → Resource Fees → Output
```

### Calculation Flow

1. **Base Price**: `court.basePrice × duration`

2. **Rule Application Loop**: For each active rule (sorted by priority):
   - Check applicability (time window, day of week, court type)
   - If applicable, calculate adjustment based on modifier type
   - Track which rules were applied for transparency

3. **Resource Fees**:
   - Equipment: `Σ(item.pricePerHour × quantity × duration)`
   - Coach: `coach.hourlyRate × duration`

4. **Output**: Complete breakdown showing:
   - Court fee (after rules)
   - Each applied rule with its adjustment
   - Equipment fee
   - Coach fee
   - Total

### Key Design Choices

**Stackable Rules**: Rules are additive/multiplicative based on their type. A Saturday evening indoor booking might have:
- Weekend rule: +$10
- Peak hour rule: 1.5x
- Indoor premium: +$5

All these stack, creating transparent pricing the user can understand.

**Separation of Concerns**: The pricing engine is a pure utility class with static methods. It receives data (court, rules, resources) and returns calculations. It doesn't interact with the database directly - the controller fetches data and passes it in. This makes testing straightforward and keeps the code modular.

**Real-time Preview**: The `/calculate-price` endpoint allows the frontend to show live pricing as users select options, before they commit to booking. This improves UX by eliminating pricing surprises.

---

## Concurrency Handling

For preventing double bookings, I implemented **MongoDB transactions**:

```javascript
const session = await mongoose.startSession();
session.startTransaction();
try {
  // Check availability
  // Create booking
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
}
```

This ensures atomicity - if the availability check passes but another request slips in before our insert, the transaction fails and rolls back cleanly.

---

## Trade-offs and Assumptions

1. **Fixed 1-hour slots**: Simplified the time slot logic. A future enhancement could support variable durations.

2. **Equipment pooling**: All equipment is available to all courts. Could be enhanced to assign equipment to specific courts.

3. **Coach availability as a map**: Flexible per-day availability, but doesn't support complex patterns like "available every other Monday."

4. **Denormalized pricing in bookings**: Takes more storage but provides audit trail and handles price changes gracefully.

The architecture is designed to be extended - adding new resource types, pricing rules, or booking constraints requires minimal changes to the core logic.
