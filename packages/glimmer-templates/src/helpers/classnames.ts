/**
 * This helpers converts input classes and states into
 * runtime dynamic classes from the optimizer.
 *
 * The arguments that are passed in come from the rewriter;
 * this helper is never invoked directly and as such the
 * api it provides is not optimized for human consumption.
 * but rather, for speed of evaluation.
 *
 * Arguments:
 * 1: number of source expressions
 * 2: number of output expressions
 *
 * Source Expression:
 * 1: type: 1 - boolean, 2 - string switch, 3, boolean ternary
 * The rest of the arguments for each source expression vary by type:
 *
 * Boolean:
 * 1: boolean type: 1 - ast expression, 2 - dependency, 3 - both 1 & 2.
 * if boolean type is a dependency:
 *   b1: number (D) of style indexes this is dependent on.
 *   b2..(bD): style indexes that must be set for this to be true
 * if ast expression:
 *   (4+d): ast expression result to evaluate as truthy
 * Then:
 *   2: number (s) of source styles set by the expression
 *   (s0...sN): source style indexes that are set if true.
 *
 * String switch:
 * 1: conditional type: 4 - switch, 5 - both switch and dependency
 * if conditional type has a dependency:
 *   2: number (d) of style indexes this is dependent on.
 *   3..((3)+d-1): style indexes that must be set for this to be true
 * 1: number (n) of strings that can be returned
 * 2: whether a falsy value is an error (0), unsets the values (1)
 *    or provide a default (2) if a string
 * 3?: the default value if the falsy behavior is default (2)
 * then: expression to evaluate as a string
 * For each of the <n> strings that can be returned:
 *   1: string that can be returned by the expression
 *   2: number (s) of source styles set. s >= 1
 *   3..3+s-1: indexes of source styles set
 *
 * Boolean Ternary:
 * 1: number (t) of source styles set if true
 * 2: number (f) of source styles set if false
 * 3: expression to evaluate as truthy
 * 4..(4+t-1): indexes of source styles set if true
 * (4+t)..(4+t+f-1): indexes of source styles set if false
 *
 * Output expresions:
 * 1: classname to set if output expression is true
 * 2: the start of an output boolean expression
 *
 * Output Boolean expressions:
 * 1: expression type - one of the following:
 *   -1: negate next expression that follows
 *   -2: compute a logical "or" of the next <o> expressions that follow
 *   -3: compute a logical "and" of the next <a> expressions that follow
 *   non-negative number: true if that source style index is true, false otherwise.
 * If the expression type is -2 or -3 the next argument is a number of
 * expressions to expect for this expression.
 *
 * The remaining indexes are processed "recursively" as output expressions
 *
 * Please note: this helper can currently process expressions that are not
 * produced by the analyzer/rewriter. This includes:
 *   - Having a dependency on more than one style
 *   - switch statements with defaults
 *   - switch statements where the value is not the same as the subState names
 */

export enum SourceExpression {
  ternary = 0,
  dependency = 1,
  boolean = 2,
  booleanWithDep = 2 | 1,
  switch = 4,
  switchWithDep = 4 | 1,
}

export enum FalsySwitchBehavior {
  error = 0,
  unset = 1,
  default = 2,
}

export enum BooleanExpr {
  not = -1,
  or = -2,
  and = -3,
}

export default {
  name: 'helper:/css-blocks/components/classnames',
  func: function _classnames(args: any[]) {
    return args.join('');
  }
};