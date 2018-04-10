export enum AnswerType {
  Text = 'text',
  // [min, max] over ℝ
  RangeContinuous = 'range-continuous',
  // [min, max] over ℕ
  RangeDiscrete = 'range-discrete',
  MultipleChoice = 'multiple-choice'
}
