import * as express from "express"
import { AppDataSource } from "../connection";
import { Org } from "../entities/org";
import { orgData } from "./types";
import * as http from "http"
import setHeaders from "../middleware";
import { Repo } from "../entities/repo";
import { Contribution } from "../entities/contribution";

const router = express.Router();
express().use(setHeaders);

const addOrgToDb = async (data:orgData,orgName:string) => {

    let totalIssues:number = 0;
    let totalCommits:number = 0;
    let totalPrOpen:number = 0;
    let totalRepos = data.hfestRepos;
    let name = data.name;
    let url = data.url;
    let avatar_url = data.avatarUrl;
    let uName = orgName;
    let desc = data.description;

    let newOrg:Org;

    data.repos.forEach((repo) => {
        totalCommits += repo.totalCommits;
        totalIssues += repo.openIssues;
        totalPrOpen +=  repo.prOpen;
    })

    const org = AppDataSource.getRepository(Org);

    newOrg =  org.create({
        name,
        uName,
        url,
        desc,
        avatar_url,
        totalPrOpen,
        totalCommits,
        totalIssues,
        totalRepos
    });
        
    await org.save(newOrg);
    
    return newOrg;

} 

const addRepos = async (data,orgId) => {

    const orgRepo = AppDataSource.getRepository(Org);
    const repoRepo = AppDataSource.getRepository(Repo)

    const org = await orgRepo.findOne({
        where:{
            id:orgId
        }
    })
    data.forEach(async (repo) => {

        if(repo.desc == null){
            repo.desc = ""
        }

        var newRepo = repoRepo.create({
            name:repo.name,
            uName:"test",
            url:repo.url,
            desc:repo.description==null?"":repo.description,
            totalPrOpen:repo.prOpen,
            totalCommits:repo.totalCommits,
            totalIssues:repo.openIssues,
            topics:repo.topics,
            org:org
        })
        
        await repoRepo.save(newRepo).catch(err => {
            console.log("Error:"+err);
        });

        addContributor(newRepo,repo.contributors)

    })

    return "Repos added successfully";
}

const addContributor = async (repo:Repo,repoContributors:Contribution[]) => {
    
    const client = AppDataSource.getRepository(Contribution)

    repoContributors.forEach(async (contributor) => {
    
        const newContributor = client.create({
            githubId:contributor.githubId,
            name:contributor.name,
            contributions:contributor.contributions,
            picLink:contributor.picLink,
            repo:repo
        });

        await client.save(newContributor)
    });

    return;
}

router.get("/addC/:username",async (req,res) => {
    
    const orgName = req.params.username;
    let data:orgData = {
        name: "",
        avatarUrl: "",
        description: "",
        url: "",
        hfestRepos: 0,
        repos:[]
    }

    http.get("http://localhost:3060/"+orgName, (result) => {
        
        result.on('data',(chunk) => {
            data = JSON.parse(chunk);
        })

        result.on('end',async () => {
            let org  = await addOrgToDb(data,orgName);
            addRepos(data.repos,org.id)
        });

    })
    .on('error', (error) => {
        res.send("Error fetching data"+error)
    })
    .end();

    res.send("Data inserted successfully");

})

export {router as addOrg}