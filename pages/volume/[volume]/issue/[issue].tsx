import { NextPageContext } from "next";
import Head from "next/head";
import MixedArticleDisplay from "../../../../components/MixedArticleDisplay";
import { get_articles_by_query } from "../../../../db";
import styles from "../../../../styles/Issue.module.css";
import { ReceivedArticle } from "../../../../ts_types/db_types";

interface Props {
	articles: ReceivedArticle[];
	volume: number;
	issue: number;
}

const Issue_Component = (props: Props) => {
	return (
		<>
			<Head>
				<title>{`Volume ${props.volume} Issue ${props.issue}`}</title>
				<meta
					name="description"
					content={`Volume ${props.volume} Issue ${props.issue} by The Stuyvesant Spectator`}
				/>
			</Head>

			<main id={styles.main}>
				<h1>
					Volume {props.volume} Issue {props.issue}
				</h1>
				<MixedArticleDisplay
					articles={props.articles}
					display_department
				/>
			</main>
		</>
	);
};

export async function getServerSideProps(context: NextPageContext) {
	const volume = Number(context.query.volume);
	const issue = Number(context.query.issue);
	let articles = await get_articles_by_query({ volume, issue }, 75);
	articles = JSON.parse(JSON.stringify(articles));
	if (articles.length > 0) {
		return {
			props: {
				articles,
				volume,
				issue,
			},
		};
	} else {
		return {
			notFound: true,
			props: { attempted_identifier: { volume, issue } },
		};
	}
}

export default Issue_Component;
