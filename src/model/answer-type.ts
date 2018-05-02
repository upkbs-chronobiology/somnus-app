export enum AnswerType {
  Text = 'text',
  // [min, max] over ℝ
  RangeContinuous = 'range-continuous',
  // [min, max] over ℕ
  RangeDiscrete = 'range-discrete',
  MultipleChoiceSingle = 'multiple-choice-single',
  MultipleChoiceMany = 'multiple-choice-many'
}
