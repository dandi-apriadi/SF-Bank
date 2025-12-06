# QA & Deployment Checklist

## 🧪 Quality Assurance Testing

### ✅ Code Quality
- [x] No JavaScript errors
- [x] No console warnings
- [x] Proper React hooks usage
- [x] No memory leaks (state cleanup)
- [x] Proper event handling
- [x] Dark mode variables set correctly

### ✅ Feature 1: Week Editing

#### Functionality Tests
- [ ] Click "➕ Add" button on any member row
- [ ] Verify week dropdown shows all weeks 1-53
- [ ] Select a week that doesn't exist → form should be empty
- [ ] Verify default week shows "Auto: Next After Last"
- [ ] Enter resources for new week
- [ ] Click submit → alert shows "ditambahkan"
- [ ] Verify data appears in table
- [ ] Check member's last_contribution updates
- [ ] Verify total_rss increases correctly

#### Edit Previous Week Tests
- [ ] Add contribution to Week 5
- [ ] Open Add panel again for same member
- [ ] Select Week 5 from dropdown
- [ ] Verify form auto-loads previous data
- [ ] Week 5 should show "(Sudah Ada - Edit)" indicator
- [ ] Modify one resource value
- [ ] Submit → alert shows "diperbaharui"
- [ ] Verify data was updated (not duplicated)
- [ ] Check database: only 1 record for Week 5

#### Validation Tests
- [ ] Try to submit with all resources empty → error alert
- [ ] Try to submit week < 1 → validation error
- [ ] Try to submit week > 53 → validation error
- [ ] Try with member not in alliance → error
- [ ] Try with invalid alliance ID → error

#### Week Detection Tests
- [ ] Add Week 1 → next default should be Week 2
- [ ] Add Week 1, 3 → default should be Week 4
- [ ] Add Week 1-5 → default should be Week 6
- [ ] Verify existingWeeks array matches contributions
- [ ] Test with member having 0 contributions

#### Dark Mode Tests
- [ ] Week dropdown displays correctly in dark mode
- [ ] Form labels are readable
- [ ] Input fields have proper contrast
- [ ] Button colors show properly
- [ ] Alert messages are visible

#### Mobile Tests
- [ ] Week dropdown fits on mobile screen
- [ ] Form layout is not crowded
- [ ] Buttons are touch-friendly (min 44px height)
- [ ] No horizontal scrolling needed

### ✅ Feature 2: Member Report

#### Desktop Button Tests
- [ ] "📊 Report" button appears in Actions column
- [ ] Click report button → modal opens
- [ ] "➕ Add" button appears next to Report
- [ ] Click add button → RSS panel opens (not report)

#### Mobile Button Tests
- [ ] "📊 Report" button appears in member card
- [ ] "➕ Add" button appears in member card
- [ ] Buttons stack vertically on mobile
- [ ] Touch targets are adequate (>44px)
- [ ] Click report button → modal opens fullscreen

#### Modal Display Tests
- [ ] Modal header shows member name and governor ID
- [ ] X button in header closes modal
- [ ] Close button in footer closes modal
- [ ] Modal doesn't go off-screen on mobile
- [ ] Scrolling works for long content

#### Summary Cards Tests
- [ ] Total RSS card shows correct total
  - Calculate: SUM(all food + wood + stone + gold from all weeks)
- [ ] Weeks Donated card shows count
  - Count unique weeks with contributions
- [ ] Contributions card shows count
  - Count total contribution records
- [ ] Last Activity shows latest date
  - Should be most recent contribution

#### Resource Breakdown Tests
- [ ] Food card shows total food
- [ ] Wood card shows total wood
- [ ] Stone card shows total stone
- [ ] Gold card shows total gold
- [ ] Sum of 4 resources = Total RSS
- [ ] Emoji icons display correctly
- [ ] Numbers are formatted properly

#### Weekly Table Tests
- [ ] Table appears if member has contributions
- [ ] All columns show data
- [ ] Rows sorted by week descending (newest first)
- [ ] Week shows as "W1", "W2", etc.
- [ ] Each resource shows correct amount
- [ ] Total column = sum of 4 resources
- [ ] Date format is consistent
- [ ] Table scrolls horizontally on mobile
- [ ] Hover effect shows on desktop

#### Empty State Tests
- [ ] Member with 0 contributions shows message
- [ ] Message: "No contributions recorded yet"
- [ ] Modal doesn't break with empty state
- [ ] Summary still shows (all zeros)
- [ ] Table not shown (replaced with message)

#### Dark Mode Tests
- [ ] Modal background is dark
- [ ] Text is readable (good contrast)
- [ ] Cards have proper dark styling
- [ ] Table rows are visible
- [ ] Buttons show correctly
- [ ] Icons display properly

#### Responsive Tests
- [ ] Mobile: Full width modal
- [ ] Tablet: Centered modal
- [ ] Desktop: Centered modal with max-width
- [ ] All content visible without horizontal scroll
- [ ] Resource cards stack properly

#### Data Accuracy Tests
- [ ] Total RSS = sum of all resources across all weeks
- [ ] Weeks Donated = count of unique weeks
- [ ] Last Activity = most recent date
- [ ] Weekly totals are correct
  - Calculate: food + wood + stone + gold

### ✅ Cross-Feature Tests

#### Interaction Tests
- [ ] Open report → close → open Add panel → close
- [ ] Open Add panel → select old week → close → open report
- [ ] Add contribution → close → open report → verify data updated
- [ ] Add contribution in Week 5 → edit Week 5 → verify report shows latest data
- [ ] Multiple members → open reports on different members
- [ ] Rapid clicking of report buttons → no errors

#### State Management Tests
- [ ] Form state clears after submit
- [ ] Report modal state resets on close
- [ ] Selected member properly tracked
- [ ] Report member properly tracked
- [ ] No state bleeding between operations

#### Scroll & Navigation Tests
- [ ] Scroll member list → buttons still clickable
- [ ] Scroll in report → all content accessible
- [ ] Long contribution list in report → can scroll
- [ ] Pagination doesn't break report
- [ ] Back navigation works correctly

### ✅ Browser Compatibility

#### Chrome
- [ ] All features work
- [ ] No console errors
- [ ] Responsive design works
- [ ] Dark mode works

#### Firefox
- [ ] All features work
- [ ] No console errors
- [ ] Responsive design works
- [ ] Dark mode works

#### Safari
- [ ] All features work
- [ ] No console errors
- [ ] Responsive design works
- [ ] Dark mode works

#### Edge
- [ ] All features work
- [ ] No console errors
- [ ] Responsive design works
- [ ] Dark mode works

#### Mobile Browsers
- [ ] iOS Safari: All working
- [ ] Android Chrome: All working
- [ ] Android Firefox: All working

---

## 📱 Device Testing

### Mobile Devices
- [ ] iPhone 12 (390px width)
- [ ] iPhone XR (414px width)
- [ ] iPad (768px width)
- [ ] Android phone (375px width)
- [ ] Android tablet (600px width)

### Screen Sizes
- [ ] 320px (old phones) - minimal
- [ ] 375px (mobile standard)
- [ ] 640px (tablet portrait)
- [ ] 768px (tablet landscape)
- [ ] 1024px (desktop)
- [ ] 1920px (large desktop)

---

## 📊 Database Testing

### Unique Constraint Testing
```sql
-- Should work: insert week 5 for member 1
INSERT INTO member_contributions 
  (member_id, alliance_id, week, date, food, wood, stone, gold)
VALUES (1, 1, 5, NOW(), 100, 100, 100, 100);

-- Should work: insert week 5 for member 2
INSERT INTO member_contributions 
  (member_id, alliance_id, week, date, food, wood, stone, gold)
VALUES (2, 1, 5, NOW(), 100, 100, 100, 100);

-- Should fail: duplicate (member 1, alliance 1, week 5)
INSERT INTO member_contributions 
  (member_id, alliance_id, week, date, food, wood, stone, gold)
VALUES (1, 1, 5, NOW(), 200, 200, 200, 200);
```

### Audit Log Testing
- [ ] Check audit_logs for week edits
- [ ] Verify audit entry contains: who, what, when
- [ ] Verify week number is logged
- [ ] Verify total RSS is logged
- [ ] Multiple edits create multiple audit entries

### Data Consistency Tests
- [ ] Sum(food) from contributions = total_food on alliance
- [ ] Sum(wood) from contributions = total_wood on alliance
- [ ] Sum(stone) from contributions = total_stone on alliance
- [ ] Sum(gold) from contributions = total_gold on alliance
- [ ] No orphaned contribution records

---

## 🔐 Security Testing

### Authorization Tests
- [ ] Non-authenticated user can't submit contribution
- [ ] User must be member to contribute
- [ ] Admin can edit any member's contribution
- [ ] Member can only see their own in some views
- [ ] No SQL injection via week parameter
- [ ] No SQL injection via resource values

### Input Validation Tests
- [ ] Negative numbers rejected or handled
- [ ] Very large numbers (>999999999) handled
- [ ] Decimal numbers converted to integers
- [ ] NULL values rejected with error
- [ ] Non-numeric input rejected

---

## 📈 Performance Testing

### Load Testing
- [ ] With 10 members: <1s load
- [ ] With 50 members: <2s load
- [ ] With 100 members: <3s load
- [ ] With 500 members: <5s load

### Pagination Tests
- [ ] First page loads correctly
- [ ] Last page loads correctly
- [ ] Navigation between pages smooth
- [ ] Pagination doesn't break with filters

### Memory Tests
- [ ] No memory leaks after opening/closing report 10x
- [ ] No memory leaks after adding 10 contributions
- [ ] Browser memory stable over time

---

## 🐛 Bug & Edge Case Testing

### Edge Cases
- [ ] Member with 1 contribution
- [ ] Member with 53 contributions (all weeks)
- [ ] Contribution with 0 resources on some types
- [ ] Contribution with very large numbers
- [ ] Week 1 vs Week 53 boundary
- [ ] Very long member names (>100 chars)
- [ ] Special characters in names
- [ ] Date at year boundary (Dec 31, Jan 1)

### Error Scenarios
- [ ] Network error while loading data
- [ ] Network error while submitting
- [ ] Member deleted while report open
- [ ] Alliance deleted while report open
- [ ] Permission changed while editing
- [ ] Session expires while editing
- [ ] Database error during save
- [ ] Duplicate browser tabs

---

## 📋 Acceptance Criteria

### Week Editing Feature
- [x] Users can select any week 1-53
- [x] System marks weeks with existing data
- [x] Form auto-loads existing data
- [x] System prevents duplicates
- [x] Alert distinguishes create vs update
- [x] Date field is read-only and auto-set to today UTC
- [x] Audit trail maintains record of edits

### Member Report Feature
- [x] Report accessible via button in table
- [x] Report accessible via button in mobile card
- [x] Modal shows member name and governor ID
- [x] Modal shows summary statistics (4 cards)
- [x] Modal shows resource breakdown (4 cards)
- [x] Modal shows weekly detail table (sorted by week DESC)
- [x] Modal is responsive on all devices
- [x] Modal supports dark mode
- [x] Report uses cached data (no new API calls)
- [x] Empty state handled gracefully

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All QA tests passed
- [ ] Code review completed
- [ ] No breaking changes to other features
- [ ] Database schema unchanged
- [ ] API contracts unchanged
- [ ] Environment variables documented
- [ ] Build completes without warnings

### Deployment Steps
1. [ ] Create backup of database
2. [ ] Deploy frontend code
3. [ ] Clear browser cache/CDN cache
4. [ ] Verify all routes load
5. [ ] Test in production-like environment
6. [ ] Monitor error logs
7. [ ] Get user sign-off

### Post-Deployment
- [ ] Monitor error rates (should be 0)
- [ ] Check performance metrics
- [ ] Verify audit logs are being recorded
- [ ] User feedback collection
- [ ] Document any issues
- [ ] Plan bug fixes if needed

---

## 📞 Support & Rollback

### If Issues Found
1. Identify root cause
2. Log issue details
3. Create hotfix branch
4. Test thoroughly
5. Deploy patch
6. Update documentation

### Rollback Procedure
```bash
# If critical issue found:
git revert <commit-hash>
# or
git checkout <previous-version>
# Deploy previous version
```

---

## 📝 Documentation

### Admin User Guide
- [ ] Create user guide for week editing
- [ ] Create user guide for member report
- [ ] Add screenshots
- [ ] Add video walkthrough
- [ ] Share with admin team

### Developer Documentation
- [x] Code comments updated
- [x] Implementation summary created
- [x] Guides created

### Release Notes
- [ ] Summarize new features
- [ ] List bug fixes
- [ ] Note breaking changes (if any)
- [ ] Provide upgrade instructions

---

## 👥 Sign-Off

### Stakeholders
- [ ] Product Owner: Approved
- [ ] QA Lead: Tests passed
- [ ] Security: No vulnerabilities
- [ ] DevOps: Deployment ready
- [ ] Admin Team: Feature validated

---

## 📊 Metrics to Monitor

### After Deployment
```
Track:
- Error rate (target: 0%)
- Feature usage (adoption rate)
- Performance impact (<100ms added latency)
- User feedback (positive/negative)
- Bug reports (expect <3 in first week)
```

---

## ✅ Sign-Off Template

```
Date: ___________
Tested By: ___________
QA Status: ☐ PASS ☐ FAIL
Issues Found: ___________
Ready for Production: ☐ YES ☐ NO
Approved By: ___________
```

---

**Last Updated**: December 6, 2025
**Status**: Ready for QA Testing
**Estimated Testing Time**: 2-3 hours
**Estimated Deployment Time**: 30 minutes
