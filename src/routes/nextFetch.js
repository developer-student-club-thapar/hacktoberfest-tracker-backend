"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.nextFetch = void 0;
var express = require("express");
var connection_1 = require("../connection");
var org_1 = require("../entities/org");
var repo_1 = require("../entities/repo");
var octokit_1 = require("octokit");
var octo = new octokit_1.Octokit();
var router = express.Router();
exports.nextFetch = router;
router.get('/verifyDB/:orgName', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orgName, onGithub, err_1, orgRepo, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                orgName = req.params.orgName;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, octo.request("GET /orgs/{owner}", {
                        owner: orgName
                    })];
            case 2:
                onGithub = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                onGithub = false;
                return [3 /*break*/, 4];
            case 4:
                orgRepo = connection_1.AppDataSource.getRepository(org_1.Org);
                return [4 /*yield*/, orgRepo.createQueryBuilder('org')
                        .select('org.id')
                        .where('org.uName = :uName', { uName: orgName })
                        .leftJoinAndSelect('org.repos', 'repos')
                        .getOne()];
            case 5:
                data = _a.sent();
                if (data && onGithub) {
                    res.status(200).json({ verifiedDB: true });
                }
                else {
                    if (!onGithub)
                        res.status(400).json({ verifiedDB: false, message: "Not on Github" });
                    else
                        res.status(400).json({ verifiedDB: false, message: "Not in DB" });
                }
                return [2 /*return*/];
        }
    });
}); });
router.get('/next/:orgName', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orgName, orgRepo, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                orgName = req.params.orgName;
                console.log(orgName);
                orgRepo = connection_1.AppDataSource.getRepository(org_1.Org);
                return [4 /*yield*/, orgRepo.createQueryBuilder('org')
                        .where('org.uName = :uName', { uName: orgName })
                        .leftJoinAndSelect('org.repos', 'repos')
                        .getOne()];
            case 1:
                data = _a.sent();
                res.status(200).json(data);
                return [2 /*return*/];
        }
    });
}); });
router.get('/next/:orgName/:repo', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var repoRepo, repoName, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                repoRepo = connection_1.AppDataSource.getRepository(repo_1.Repo);
                repoName = req.params.repo;
                return [4 /*yield*/, repoRepo.createQueryBuilder('repo')
                        .where("repo.name = :repoName", { repoName: repoName })
                        .getOne()];
            case 1:
                data = _a.sent();
                res.json(data);
                return [2 /*return*/];
        }
    });
}); });
router.get('/contributors/:orgName/:repo/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var repoRepo, repoName, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                repoRepo = connection_1.AppDataSource.getRepository(repo_1.Repo);
                repoName = req.params.repo;
                return [4 /*yield*/, repoRepo.createQueryBuilder('repo')
                        .select('repo.id')
                        .where('repo.name = :repo', { repo: repoName })
                        .leftJoinAndSelect('repo.contributions', 'contributions')
                        .getOne()];
            case 1:
                data = _a.sent();
                res.json(data);
                return [2 /*return*/];
        }
    });
}); });
router.get('/issues/:orgName/:repo/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var repoRepo, repoName, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                repoRepo = connection_1.AppDataSource.getRepository(repo_1.Repo);
                repoName = req.params.repo;
                return [4 /*yield*/, repoRepo.createQueryBuilder('repo')
                        .select('repo.id')
                        .where('repo.name = :repo', { repo: repoName })
                        .leftJoinAndSelect('repo.issues', 'issues')
                        .getOne()];
            case 1:
                data = _a.sent();
                res.json(data);
                return [2 /*return*/];
        }
    });
}); });
