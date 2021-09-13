import wixData from 'wix-data';
import {created, badRequest} from 'wix-http-functions';
import {awardToLearners} from "backend/badging-award-to-learners"
import {reverseFixUpDateForHST, generateLearnerToken, isLearnerProfileComplete} from "public/badging-utils"
import {requestProfileUpdate} from "backend/badging-request-profile-update"

// URL to call this HTTP function from your published site looks like:
// https://www.vibranthawaii.org/_functions/example/multiply?leftOperand=3&rightOperand=4

// URL to test this HTTP function from your saved site looks like:
// https://www.vibranthawaii.org/_functions-dev/teachableNewUser/?siteRevision=774
// https://www.vibranthawaii.org/_functions-dev/example/multiply?leftOperand=3&rightOperand=4

export function post_teachableNewUser(request) {
    const response = {
        "headers": {
            "Content-Type": "application/json"
        }
    };

    response.body = {
        "endpoint": "post_teachableNewUser"
    }
    return created(response);
}

export function post_teachableEnrollmentCompleted(request) {
    let type = "";
    let name = "";
    let email = "";
    let badge = {};
    let teachableCourseId = "";
    let teachableInferredEulaDate = "";
    let learnerToken = "";
    let awardedDate = "";

    return request.body.json()
        .then(requestJSON => {
            // Validate input
            type = requestJSON.type;
            name = requestJSON.object.user.name;
            email = requestJSON.object.user.email;
            teachableCourseId = requestJSON.object.course.id;
            teachableInferredEulaDate = requestJSON.object.user.created_at;

            if (type != "Enrollment.completed")
                throw 'invalid webhook data type: ' + type;

            if (name.length < 3)
                throw 'invalid user name: ' + name;

            if (!email.match(/[\w.+-_~]+\@[\w.+-_~]+\.[\w.+-_~]+\.*[\w.+-_~]*/))
                throw 'invalid user email address: ' + email;

            if (teachableCourseId.length < 5)
                throw 'invalid course id: ' + teachableCourseId;

            learnerToken = generateLearnerToken(name, email).toString(); // toString for Wix code completion reasons only
            awardedDate = reverseFixUpDateForHST(requestJSON.object.created_at).toString();

            return wixData.query("Badging-BadgesBrief")
                .eq("teachableCourseId", teachableCourseId.toString())
                .find()
        })
        .then( (matchingBadges) => {
            if (matchingBadges.items.length === 0)
                throw "No badge found with Teachable Course ID: " + teachableCourseId;

            if (matchingBadges.items.length != 1)
                throw "More than one badge found with Teachable Course ID: " + teachableCourseId;

            badge = matchingBadges.items[0];
            let expiryDate = "";
            if (badge.expiryRule !== undefined) {
                let months = badge.expiryRule;
                let date = new Date();
                var d = date.getDate();
                date.setMonth(date.getMonth() + +months);
                if (date.getDate() != d) {
                    date.setDate(0);
                }
                expiryDate = date.toDateString();
            }

            let awardedUserDict = {};
            awardedUserDict[learnerToken] = {
                'name': name,
                'learnerToken': learnerToken,
                'pii': {
                    'email': email,
                },
                'award': {
                    'badgeRef': badge._id,
                    'awardedDate': awardedDate,
                    'expiryDate': expiryDate,
                },
                'supportsRegions': null,
                'teachableInferredEulaDate': teachableInferredEulaDate
            }

            return awardToLearners(awardedUserDict, null);
        })
        .then(() => {
            return wixData.query("Badging-Learners")
                .contains("learnerToken", learnerToken)
                .find()
        })
        .then(learnerResults => {
            if (learnerResults.items.length != 1)
                throw("Unique learner ID not found for token " + learnerToken);

            const learner = learnerResults.items[0];
            if (!isLearnerProfileComplete(learner))
                return requestProfileUpdate(learner._id, badge._id);
            else
                return Promise.resolve();
        })
        .then(() => {
            console.log("In post_teachableEnrollmentCompleted, awards successfully issued.")
            const response = {
                "headers": {
                    "Content-Type": "application/json"
                }
            };

            response.body = {
                "result": "success",
                "endpoint": "post_teachableEnrollmentCompleted"
            }

            return created(response);
        })
        .catch(error => {
            console.log(error);
            return badRequest({body: {"error": error}});
        })
}

