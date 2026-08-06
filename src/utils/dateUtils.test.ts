import { generateAll156Weeks } from './dateUtils';

console.log('--- TEST CALENDAR ENGINE ---');
const weeks = generateAll156Weeks();

console.log(`Total generated weeks: ${weeks.length}`);
if (weeks.length === 156) {
  console.log('✅ PASS: Exactly 156 weeks generated.');
} else {
  console.error(`❌ FAIL: Expected 156 weeks, got ${weeks.length}`);
}

console.log('Week 1:', weeks[0]);
console.log('Week 52 (End of Year 1):', weeks[51]);
console.log('Week 104 (End of Year 2):', weeks[103]);
console.log('Week 156 (End of Year 3):', weeks[155]);

const year1Count = weeks.filter((w) => w.ausbildungsjahr === 1).length;
const year2Count = weeks.filter((w) => w.ausbildungsjahr === 2).length;
const year3Count = weeks.filter((w) => w.ausbildungsjahr === 3).length;

console.log(`Year 1 weeks: ${year1Count}`);
console.log(`Year 2 weeks: ${year2Count}`);
console.log(`Year 3 weeks: ${year3Count}`);

if (year1Count === 52 && year2Count === 52 && year3Count === 52) {
  console.log('✅ PASS: Perfect distribution of 52 weeks per apprenticeship year.');
} else {
  console.error('❌ FAIL: Year week distribution mismatch!');
}
