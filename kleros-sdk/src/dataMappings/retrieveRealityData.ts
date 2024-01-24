import { executeAction } from "./executeActions";
import { AbiEventMapping, DataMapping } from "./utils/dataMappingTypes";
import { Answer } from "./utils/disputeDetailsTypes";

export const retrieveRealityData = async (realityQuestionID: string, arbitrable?: `0x${string}`) => {
  if (!arbitrable) {
    throw new Error("No arbitrable address provided");
  }
  const questionMapping: DataMapping<AbiEventMapping> = {
    type: "abi/event",
    abi: "event LogNewQuestion(bytes32 indexed question_id, address indexed user, uint256 template_id, string question, bytes32 indexed content_hash, address arbitrator, uint32 timeout, uint32 opening_ts, uint256 nonce, uint256 created)",
    address: arbitrable,
    eventFilter: {
      args: [realityQuestionID],
      fromBlock: "0x1",
      toBlock: "latest",
    },
    seek: [
      "question_id",
      "user",
      "template_id",
      "question",
      "content_hash",
      "arbitrator",
      "timeout",
      "opening_ts",
      "nonce",
      "created",
    ],
    populate: [
      "realityQuestionID",
      "realityUser",
      "realityTemplateID",
      "realityQuestion",
      "contentHash",
      "arbitrator",
      "timeout",
      "openingTs",
      "nonce",
      "created",
    ],
  };

  const questionData = await executeAction(questionMapping);
  console.log("questionData", questionData);

  const templateMapping: DataMapping<AbiEventMapping> = {
    type: "abi/event",
    abi: "event LogNewTemplate(uint256 indexed template_id, address indexed user, string question_text)",
    address: arbitrable,
    eventFilter: {
      args: [0],
      fromBlock: "0x1",
      toBlock: "latest",
    },
    seek: ["template_id", "question_text"],
    populate: ["templateID", "questionText"],
  };

  const templateData = await executeAction(templateMapping);
  console.log("templateData", templateData);

  const rc_question = require("@reality.eth/reality-eth-lib/formatters/question.js");
  const populatedTemplate = rc_question.populatedJSONForTemplate(
    templateData.questionText,
    questionData.realityQuestion
  );

  console.log("populatedTemplate", populatedTemplate);

  let answers: Answer[] = [];
  if (populatedTemplate.type === "bool") {
    answers = [
      {
        title: "Yes",
        description: "",
        id: "0x01",
        reserved: false,
      },
      {
        title: "No",
        description: "",
        id: "0x02",
        reserved: false,
      },
    ];
  }

  answers.push({
    id: "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
    title: "Answered Too Soon",
    description: "",
    reserved: true,
  });

  return {
    question: questionData.realityQuestion,
    type: populatedTemplate.type,
    realityAddress: questionData.arbitrator,
    questionId: questionData.realityQuestionID,
    realityUser: questionData.realityUser,
    answers,
  };
};
