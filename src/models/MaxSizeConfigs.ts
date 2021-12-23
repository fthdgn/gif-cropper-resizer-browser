export interface MaxSizeConfigs {
  /**
   * Maximum base64 string length of result
   */
  maxBase64Length: number,
  /**
   * Maximum iteration number until achieving `maxBase64Length`
   */
  maxIteration: number,
  /**
   * Whether to fail or not when `maxBase64Length` is not achieved and the iteration count reached `maxIteration`
   */
  failIfTargetNotAchieved: boolean,
}
