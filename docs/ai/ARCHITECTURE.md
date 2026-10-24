# AI Lyrics Processor — Architecture & Technical Documentation

**Project:** Shalom Worship  
**Module:** AI Lyrics Processor  
**Status:** Proposed  
**Technology:** Next.js App Router, TypeScript, Zod, and configurable AI providers

## 1. Overview

The AI Lyrics Processor is a provider-independent module within the existing Shalom Worship application.

Its purpose is to accept formatted song lyrics, detect the source language, generate native-script lyrics and English translations, validate the generated content, and return structured data for administrator review.

The processor must integrate with the existing Version 4 lyrics schema and must not save generated lyrics directly to the database.

### Objectives

- Automatically detect the source language and infer the appropriate native script.
- Generate Romanized lyrics, native-script lyrics, and English translations.
- Preserve section order, lyric line order, and repetition markers.
- Validate AI-generated results before returning them to the application.
- Support multiple AI providers through a common interface.
- Integrate with the existing song editor for review, editing, approval, and persistence.

### Scope

The initial implementation focuses on converting formatted lyrics into validated structured data.

Automatic database writes, autonomous publishing, and unsupported metadata generation are outside the processor's scope.

## 2. System Architecture

The system follows a layered architecture that separates HTTP handling, text parsing, AI generation, validation, and persistence.

### Processing pipeline

1. **Admin Lyrics Input:** The administrator submits formatted lyrics with optional section headings.
2. **API and Input Validation:** The API authenticates the administrator, enforces request-size limits, and validates the request.
3. **Lyrics Parser:** The parser identifies section headings, lyric lines, ordering, and repetition markers.
4. **AI Processing Engine:** The configured provider generates language content, including Romanized lyrics, native-script lyrics, and English translations.
5. **Output Validation:** Zod and additional integrity checks validate the response, section structure, line alignment, and data consistency.
6. **Admin Review:** The validated result is displayed in the song editor for review and correction.
7. **Persistence:** The existing song editor saves the administrator-approved result through the application's established persistence workflow.

### Data flow

Admin Input → API Validation → Lyrics Parser → AI Provider Adapter → Output Validation → Version 4 Mapping → Admin Review → Existing Save Workflow

The backend owns structural integrity, application metadata, and persistence rules. The AI generates language content but does not control database IDs, relationships, or save operations.

## 3. Responsibilities of Each Layer

| Layer              | Responsibility                                                                   |
| ------------------ | -------------------------------------------------------------------------------- |
| API route          | Authenticate requests, validate input, enforce limits, and return HTTP responses |
| Lyrics parser      | Parse headings, lines, repetition markers, and section order                     |
| AI prompt          | Define language detection, transliteration, translation, and preservation rules  |
| Provider interface | Establish a common contract for all supported providers                          |
| Provider adapters  | Communicate with the configured AI service                                       |
| Provider factory   | Select the configured provider and model                                         |
| Output validator   | Reject malformed or inconsistent generated content                               |
| Processor service  | Coordinate parsing, generation, validation, and error handling                   |
| Version 4 mapper   | Convert validated intermediate results into the established application schema   |
| Admin UI           | Preview, edit, approve, and submit the result for saving                         |
| Test suite         | Verify parsing, generation, validation, error handling, and integration behavior |

## 4. Recommended Project Structure

The following structure is proposed for the existing Next.js application. Files should be introduced incrementally as implementation progresses.

```text
lib/
└── ai/
    ├── ARCHITECTURE.md
    ├── lyrics-schema.ts
    ├── lyrics-parser.ts
    ├── lyrics-prompt.ts
    ├── lyrics-processor.ts
    ├── errors.ts
    ├── providers/
    │   ├── provider.interface.ts
    │   ├── provider.factory.ts
    │   ├── openai.provider.ts
    │   ├── gemini.provider.ts
    │   └── deepseek.provider.ts
    └── __tests__/
        ├── lyrics-parser.test.ts
        ├── lyrics-schema.test.ts
        └── lyrics-processor.test.ts

app/
└── api/
    └── ai/
        └── convert-lyrics/
            └── route.ts
```

The provider adapters are examples of planned extensions. The initial release should implement only one provider and add others when required.

The final directory structure may change to match existing project conventions.

## 5. Data Contracts

### 5.1 API input

The initial endpoint accepts only the lyrics text. Language and script are inferred by the AI.

**Endpoint:** `POST /api/ai/convert-lyrics`

Example request:

```json
{
  "lyricsText": "## Verse 1\nYeshu tu kitna mahaan hai\nTera prem adbhut hai\n\n## Chorus\nTeri stuti karun main"
}
```

The request schema must reject missing, empty, incorrectly typed, or excessively large inputs.

### 5.2 Intermediate AI result

The AI should return a predictable intermediate structure containing:

- Detected source language.
- Inferred native language and script.
- Section indices and section types.
- Line indices within each section.
- Romanized lyrics.
- Native-script lyrics.
- English translations.

The exact intermediate schema will be defined in `lyrics-schema.ts`.

The AI must not generate database IDs, chord metadata, artist relationships, or other application-owned metadata.

### 5.3 Final Version 4 output

The backend maps validated intermediate data into the established Version 4 lyrics schema.

The existing `arrangement` array remains the source of truth for the final lyrics structure.

The mapper is responsible for:

- Generating unique IDs where required.
- Mapping section types and labels.
- Preserving section and line ordering.
- Preserving repetition markers without duplicating the stanza.
- Initializing required fields according to the existing schema.
- Preserving existing metadata when it is explicitly provided and compatible with the operation.

The processor must not introduce a competing song format.

### 5.4 Existing metadata preservation

A lyrics-only request cannot preserve metadata that the backend has never received.

When processing an existing song, the backend must have access to the existing arrangement or relevant metadata if IDs, chords, or other fields must be retained. The mapper must distinguish between creating new lyrics and updating existing lyrics.

## 6. Parsing Rules

The parser operates before AI generation and produces a predictable representation of the input.

It should identify:

- Explicit section headings such as `## Verse 1` and `## Chorus`.
- Lyric lines and their original ordering.
- Blank-line boundaries.
- Repetition markers such as `(x2)` and `(x4)`.
- Instrumental sections or other explicitly supported section types.
- Empty or malformed sections.

Parsing rules must be deterministic and covered by unit tests.

Repetition markers must be preserved exactly where appropriate. Repeated stanzas must not be duplicated automatically unless the established input format explicitly requires duplication.

The parser must not infer musical metadata such as chords, tempo, or key from lyrics alone.

## 7. AI Provider Abstraction

The processor must remain independent of any single AI vendor.

A common provider interface will define the contract for generating structured lyrics content. Each provider adapter will implement that contract using its own API, authentication, request format, and response handling.

Potential providers include:

- OpenAI
- Google Gemini
- DeepSeek
- Future compatible providers

The provider factory selects the configured adapter and model.

Provider-specific SDKs and response formats must remain inside their adapters rather than spreading throughout the application.

The first release should use one configured provider. Multi-provider fallback should be introduced only after its behavior, cost implications, and failure handling are defined.

## 8. Output Validation and Data Integrity

AI-generated output must be treated as untrusted input.

Validation must include:

1. Structural validation using Zod.
2. Required-field and data-type validation.
3. Section count and ordering checks.
4. Line-index and line-alignment checks.
5. Required language-content checks.
6. Repetition-marker preservation checks.
7. Unique ID generation and collision prevention where applicable.
8. Validation of the final Version 4 structure.
9. Rejection of unexpected or unsupported output fields where strict schemas are required.

Validation should distinguish structural correctness from linguistic correctness. A valid JSON response does not prove that a translation is accurate.

If validation fails, the processor should return a controlled error or perform a bounded corrective retry when appropriate. It must not silently accept corrupted output.

## 9. Security and Reliability Requirements

### Authentication and authorization

- Restrict the conversion endpoint to authorized administrators.
- Verify authorization on the server for every request.
- Never rely exclusively on client-side access controls.

### Input and cost controls

- Enforce a maximum request size.
- Validate all request fields.
- Apply rate limits and appropriate AI usage budgets.
- Set reasonable provider timeouts.
- Prevent uncontrolled retries.

### API key protection

- Store provider credentials in server-side environment variables.
- Never expose API keys in browser bundles or client responses.
- Avoid logging credentials or sensitive request headers.

### Error handling

Normalize errors into application-level categories, including:

- Invalid input.
- Unauthorized request.
- Rate limit exceeded.
- Provider authentication failure.
- Provider timeout.
- Temporary provider unavailability.
- Invalid AI output.
- Internal processing failure.

Retry only appropriate transient failures, with a bounded retry policy and backoff. Do not automatically retry every error.

### Logging and observability

Record useful operational information such as provider, model, processing duration, outcome, and error category. Avoid logging full lyrics by default unless an explicitly approved privacy and retention policy permits it.

## 10. Admin Review and Persistence

The AI processor must return validated results without automatically writing them to the database.

The admin review workflow should allow an authorized administrator to:

1. Preview the generated lyrics.
2. Compare Romanized, native-script, and translated content.
3. Edit incorrect lines and section labels.
4. Approve the content.
5. Save it through the existing song editor and persistence workflow.

The application must validate the final data again at the persistence boundary. Approval of AI output must not bypass server-side validation or authorization.

## 11. Testing Strategy

The implementation should include unit, integration, and end-to-end tests as appropriate.

### Parser tests

- Standard verse and chorus headings.
- Multiple sections and ordering.
- Blank lines and empty sections.
- Repetition markers.
- Instrumental sections.
- Malformed input.

### Schema and integrity tests

- Valid Version 4 output.
- Missing required fields.
- Incorrect field types.
- Duplicate IDs.
- Incorrect section ordering.
- Missing or misaligned lyric lines.
- Unexpected output fields.

### Provider and processor tests

- Successful structured response.
- Provider timeout.
- Rate limiting.
- Temporary service unavailability.
- Authentication failure.
- Malformed AI response.
- Validation failure and bounded retry behavior.

### Linguistic quality tests

Use reviewed examples covering Hindi and other supported languages, including Romanization, native-script conversion, and English translation. Evaluate language accuracy separately from schema validity.

## 12. Non-Functional Requirements

The implementation must prioritize:

- **Maintainability:** Clear separation of responsibilities.
- **Extensibility:** New providers can be added without rewriting the processor.
- **Reliability:** Invalid results are rejected rather than silently persisted.
- **Security:** Authentication, authorization, secret protection, and usage limits.
- **Observability:** Actionable logs and measurable failure rates.
- **Cost control:** Bounded input, retries, and provider usage.
- **Testability:** Core parsing and validation logic can be tested without live AI API calls.
- **Data integrity:** The established Version 4 schema remains authoritative.

Performance targets and maximum input sizes should be specified after measuring representative workloads.

## 13. Implementation Roadmap

Implementation will proceed incrementally, with each layer tested before the next is introduced.

| Phase | Deliverable                                                            |
| ----- | ---------------------------------------------------------------------- |
| 1     | Architecture, requirements, and data-contract decisions                |
| 2     | Zod request, intermediate-result, and final-output schemas             |
| 3     | Deterministic lyrics parser and unit tests                             |
| 4     | Provider interface and factory                                         |
| 5     | First provider adapter and structured-output tests                     |
| 6     | Processor orchestration, validation, and error handling                |
| 7     | Authenticated API route and request limits                             |
| 8     | Admin review integration and persistence workflow                      |
| 9     | Integration tests, linguistic quality checks, and production readiness |

Each phase must have explicit acceptance criteria before implementation is considered complete.

## 14. Architectural Decisions

| Decision                                     | Rationale                                                       |
| -------------------------------------------- | --------------------------------------------------------------- |
| Provider-independent processor               | Avoids coupling business logic to a vendor                      |
| One provider for the first release           | Reduces initial complexity and cost                             |
| Deterministic parser before AI               | Preserves input structure and makes parsing testable            |
| Backend-owned IDs and schema                 | Protects application data integrity                             |
| Zod validation                               | Enforces runtime data contracts                                 |
| No automatic database writes                 | Keeps administrators in control of generated content            |
| Existing Version 4 schema as source of truth | Avoids incompatible duplicate formats                           |
| Human review                                 | Reduces the risk of publishing incorrect lyrics or translations |

## 15. Open Questions Before Implementation

The following decisions must be confirmed against the existing codebase:

1. The exact Version 4 Zod or TypeScript schema and its required fields.
2. The authoritative rules for recognizing headings, blank lines, and instrumental sections.
3. Whether all supported songs require three language fields or whether some fields may be empty.
4. How existing IDs, chords, and section metadata are preserved when editing a song.
5. Which provider will be used for the first release.
6. The current administrator authentication mechanism and API authorization conventions.
7. The expected maximum input size and acceptable processing time.

These decisions must be based on the existing implementation and explicit product requirements rather than assumptions.

## Conclusion

The AI Lyrics Processor will be implemented as a modular, provider-independent service within Shalom Worship. Its architecture separates parsing, language generation, validation, application-schema mapping, and persistence.

The next implementation step is to inspect the existing Version 4 lyrics schema and define the Zod contracts. No provider integration or API implementation should begin until the data contracts and parsing rules are sufficiently clear.
